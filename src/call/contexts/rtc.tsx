import Peer, { DataConnection, MediaConnection } from "peerjs";
import {
  createContext,
  Dispatch,
  MutableRefObject,
  PropsWithChildren,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { io, Socket } from "socket.io-client";
import { usePresentToast } from "../../utils";
import { socketIOBaseURL } from "../../shared/api/base";
import { BroadcastEvents } from "../enums/events.enum";
import { LocalStorageEnum } from "../../shared/enums";
import { IAuthUserProfile, IConnectedUser } from "../../user/interfaces/user";
import { CallState, RoomType } from "../enums/call.enum";
import {
  ICallMetaData,
  IInitUserConnectionDTO,
  InitCallDTO,
} from "../dtos/call.dto";
import { IApiResponse } from "../../shared/interfaces/api-response";
import { UserCallState } from "../../user/enums/user.enum";

export interface IMediaState {
  isVideoTurnedOff?: boolean;
  isAudioTurnedOff?: boolean;
}
export interface IRTCContext {
  socketRef: MutableRefObject<Socket | null>;
  peerRef: MutableRefObject<Peer | null>;
  mediaState: IMediaState;
  callReceiver: (dto: InitCallDTO) => void;
peerSocketLoaded: boolean;
callState: CallState;
setCallState: Dispatch<SetStateAction<CallState>>;
endCall: (currentRoomUsers: IConnectedUser[]) => Promise<void>;
incomingCallRef: MutableRefObject<MediaConnection | null>;
roomUsers: IConnectedUser[];
userMediaStreamRef: MutableRefObject<MediaStream | null | undefined>;


}

const RTCContext = createContext<IRTCContext>({} as unknown as IRTCContext);

export const RTCContextProvider = ({ children }: PropsWithChildren) => {
  const { presentToastMessage } = usePresentToast();
  const localUer = localStorage.getItem(LocalStorageEnum.USER);
  const user: IAuthUserProfile = localUer ? JSON.parse(localUer) : null;
  const peerRef = useRef<Peer | null>(null);
  const socketRef = useRef<Socket | null>(null);

  const userMediaStreamRef = useRef<MediaStream | null>();
  const callRef = useRef<MediaConnection | null>();
  const incomingCallRef = useRef<MediaConnection | null>(null);

  
  const [callState, setCallState] = useState<CallState>(CallState.NONE);
  const roomUsersRef = useRef<IConnectedUser[]>([]);
  const [roomUsers, setRoomUsers] = useState<IConnectedUser[]>([]);
  const [roomType, setRoomType] = useState<RoomType>(RoomType.PEER_TO_PEER);
  const [mediaState, setMediaState] = useState<IMediaState>({} as IMediaState);
  const [reConnect, setReconnect] = useState(false);
  const [peerSocketLoaded, setPeerAndSocketLoaded] = useState<boolean>(false);

  const initSocket = async (): Promise<Socket | null> => {
    return await new Promise((resolve, reject) => {
      try {
        const socket = io(`${socketIOBaseURL}`);
        socket.on("connect", () => {
          const dto: IInitUserConnectionDTO = {
            socketId: `${socket.id}`,
            peerId: `${peerRef.current?.id}`,
            userId: `${user?.userId}`,
          };
          socket?.emit(BroadcastEvents.INIT_CONNECTED_USER, dto);
          resolve(socket);
        });
        socket.on("disconnection", () => {
          console.log("socket disconnected");
          presentToastMessage("Disconnected");
          setReconnect(!reConnect);
          reject(null);
        });
        socketRef.current = socket;
      } catch (error) {
        console.log("Error initing socket", (error as Error).message);
        reject(error);
      }
    });
  };

  const initPeer = async (): Promise<Peer | null> => {
    return await new Promise((resolve, reject) => {
      try {
        const peer = new Peer();
        peer.on("open", (peerId) => {
          console.log("Peer connection open", peer);
          resolve(peer);
        });

        peer.on("call", (call) => {
          setCallState(CallState.INCOMING);
          const userExists = roomUsersRef.current.find(
            (usr) => usr?.peerId === call.peer
          );
          console.log("calling user", call.metadata);
          if (!userExists) roomUsersRef.current.push(call.metadata);
          
          call.on("stream", (stream) => {
            handleNewPeerStream(stream, call.peer, call);
          });

          call.on("close", () => {
            handleCallClosure(call.peer, call);
          });
          call.on("error", (error) => {
            roomUsersRef.current = roomUsersRef.current.filter(
              (usr) => usr?.peerId !== call.peer
            );
            setRoomUsers(roomUsersRef.current);
            presentToastMessage("Call error");
            console.log("Incoming call Error:", (error as Error).message);
          });
          incomingCallRef.current = call;
        });

        peer.on("disconnected", (error) => {
          console.log("Peer Peer Disconnected: ", error);
          presentToastMessage(error);
          setReconnect(!reConnect);
        });

        peer.on("error", (error) => {
          console.log("Error with peer communication", error);
          presentToastMessage("Error with connection peer server");
          reject(error);
          //resolve(null);
        });

        peerRef.current = peer;
      } catch (error) {
        console.log("Error initing peer", (error as Error)?.message);
      }
    });
  };

  const joinGroupCall = useCallback(
    (room: string) => {
      const handler = async (roomId: string) => {
        try {
          const usersInRoom: IApiResponse<IConnectedUser[]> = await new Promise(
            (resolve) => {
              socketRef.current?.emit(
                BroadcastEvents.GET_ROOM_USERS,
                { roomId },
                resolve
              );
            }
          );
          if (usersInRoom.error) throw new Error(`${usersInRoom.error}`);
          if (usersInRoom.data) {
            //-- call only users that are not already in call room
            const usersToCall = usersInRoom.data.filter(
              (usr) =>
                !roomUsersRef.current.find(
                  (rUsr) =>
                    rUsr.peerId === usr?.peerId ||
                    rUsr.socketId === usr?.socketId
                )
            );
            const initCallDto: Partial<InitCallDTO> = {
              metadata: {
                roomId,
                roomType: RoomType.CONFERENCE,
                ...user,
                peerId: peerRef.current?.id,
                socketId: socketRef.current?.id,
              } as any,
            };
            usersToCall.forEach((usr) => {
              callReceiver({
                ...initCallDto,
                receiverPeerId: `${usr?.peerId}`,
              } as InitCallDTO);
            });
          }
        } catch (error) {
          console.log("Error ansering group call", (error as Error).message);
        }
      };
      handler(room);
    },
    [callState]
  );

  const endCall = useCallback(
    async (currentRoomUsers: IConnectedUser[]) => {
      try {
        currentRoomUsers?.forEach((usr) => {
          usr?.mediaConnection?.close();
        });
        await cleanUpCallRoom();
        
      } catch (error) {
        console.log("Error dropping call", (error as Error).message);
      }
    },
    [callState]
  );
  const cleanUpCallRoom = async () => {
    try{
      userMediaStreamRef.current?.getTracks().forEach((track) => {
        track.stop();
      });
      userMediaStreamRef.current = null;
      roomUsersRef.current = [];
      setRoomUsers(roomUsersRef.current);
      setCallState(CallState.NONE);
      const dto: IConnectedUser = {
          callState: UserCallState.NONE,
          peerId: peerRef.current?.id,
        };
        socketRef.current?.emit(BroadcastEvents.UPDATE_USER_CALL_STATUS, dto);
        

    }catch(error){
      console.log("Error cleaning up call room", (error as Error).message);
    }
  }

  const handleCallClosure = (peerId: string, call: MediaConnection) => {
    roomUsersRef.current = roomUsersRef.current.filter(
      (usr) => usr?.peerId !== peerId
    );
    setRoomUsers(roomUsersRef.current);
    if ((call.metadata as ICallMetaData).roomType === RoomType.PEER_TO_PEER) {
      setCallState(CallState.NONE);
      cleanUpCallRoom();
    }
  };

  const handleNewPeerStream = (
    stream: MediaStream,
    remotePeerId: string,
    call?: MediaConnection
  ) => {
    try {
      setRoomType((call?.metadata as ICallMetaData).roomType);

      const newUserIndex = roomUsersRef.current?.findIndex(
        (usr) => usr?.peerId === remotePeerId
      );
      if (newUserIndex === -1) throw new Error("User not found");
      roomUsersRef.current[newUserIndex].mediaStream = stream;
      if (call) roomUsersRef.current[newUserIndex].mediaConnection = call;

      setRoomUsers(roomUsersRef.current);
      setCallState(CallState.ONGOING);

      //-- if user is not the initiator; join room
      let dto: IConnectedUser = {};
      if (call?.metadata) {
        dto = {
          roomId: (call?.metadata as ICallMetaData).roomId,
          roomType: (call?.metadata as ICallMetaData).roomType,
        };
      }

      dto.callState = UserCallState.ONGOING;
      socketRef.current?.emit(BroadcastEvents.UPDATE_USER_CALL_STATUS, dto);
    } catch (error) {
      console.log("Error handling new peer stream", (error as Error).message);
    }
  };

  useEffect(() => {
    const initSetUp = async () => {
      try{
        await initPeer();
        await initSocket();
        setPeerAndSocketLoaded(true);
        console.log("init finished");
      }catch(error){
        console.log("Error in initSetUp:", (error as Error).message)
      }
    }
    initSetUp();
  }, [reConnect]);

  const getUserMedia = (
    navigator.mediaDevices ||
    ((navigator as any).webkitMediaDevices as MediaDeviceInfo)
  ).getUserMedia;

  useEffect(() => {
    
    if(callState !== CallState.NONE && !userMediaStreamRef.current){
      getUserMedia({video: true, audio: true})
      .then((stream) => userMediaStreamRef.current = stream)
      .catch((err) => console.log("Error setting stream", err.message))
    }
  }, [callState])

  const callReceiver = async (dto: InitCallDTO) => {
    try {
      const { receiverPeerId, metadata } = dto;
      metadata.peerId = peerRef.current?.id;
      metadata.socketId = socketRef.current?.id
      const userConnectionData: IApiResponse<IConnectedUser> =
        await new Promise((resolve) => {
          socketRef.current?.emit(
            BroadcastEvents.GET_CONNECTED_USER,
            { peerId: receiverPeerId },
            resolve
          );
        });
      if (userConnectionData.error || !userConnectionData.status)
        throw new Error(`${userConnectionData.error}`);
      const userData = userConnectionData.data;
      if (
        userData?.callState === UserCallState.ONGOING &&
        dto.metadata.roomType === RoomType.PEER_TO_PEER
      )
        throw new Error("User busy");
      if (
        userData?.callState === UserCallState.ONGOING &&
        dto.metadata.roomType === RoomType.CONFERENCE &&
        userData?.roomId !== dto.metadata.roomId
      )
        throw new Error("User busy");

      const mediastream = userMediaStreamRef.current
        ? userMediaStreamRef.current
        : await getUserMedia({ video: true, audio: true });
      userMediaStreamRef.current = mediastream;
      setCallState(CallState.CALLING);
      roomUsersRef.current.push(userData as IConnectedUser);
      const call = peerRef.current?.call(receiverPeerId, mediastream, {
        metadata,
      });
      call?.on("stream", (stream) => {
        //if (remoteVideoElem.current) remoteVideoElem.current.srcObject = stream;
        handleNewPeerStream(stream, dto.receiverPeerId, call);
      });
      call?.on("close", () => {
        handleCallClosure(dto.metadata.peerId as string, call);
      });
      call?.on("error", (error) => {
        // if (error.type === "negotiation-failed")
        //   return callReceiver(dto);
        roomUsersRef.current = roomUsersRef.current.filter(
          (usr) => usr?.peerId !== receiverPeerId
        );
        setRoomUsers(roomUsersRef.current);
        console.log((error as Error).message);
        presentToastMessage("Error connecting call");
      });
      callRef.current = call;
    } catch (error) {
      console.log("Error calling user", (error as Error).message);
      presentToastMessage((error as Error).message);
    }
  };

  const initRTCContext: IRTCContext = {
    socketRef,
    peerRef,
    mediaState,
    callReceiver,
    peerSocketLoaded,
    roomUsers,
    callState,
    setCallState,
    incomingCallRef,
    endCall,
    userMediaStreamRef
  };

  return (
    <RTCContext.Provider value={initRTCContext}>
      
          {children}
               
    </RTCContext.Provider>
  );
};

export const useRTCContextStore = () => useContext<IRTCContext>(RTCContext);
