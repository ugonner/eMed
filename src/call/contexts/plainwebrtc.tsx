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
import { APIBaseURL, postData, socketIOBaseURL } from "../../shared/api/base";
import { useAudioPlay, usePresentToast } from "../../utils";
import {
  IAuthUserProfile,
  IPlainRTCConnectedUser,
} from "../../user/interfaces/user";
import {
  callPurpose,
  CallQuality,
  CallStage,
  CallState,
  CallType,
  IceConnectionState,
  RoomType,
  SDPType,
} from "../enums/call.enum";
import { IMediaState } from "./rtc";
import {
  ICallMetaData,
  InitCallDTO,
  InitPlainRTCCallDTO,
  IPlainRTCCallICECandidateDTO,
  IPlainRTCCallSDPDTO,
} from "../dtos/call.dto";
import { BroadcastEvents } from "../enums/events.enum";
import { UserCallState } from "../../user/enums/user.enum";
import { IApiResponse } from "../../shared/interfaces/api-response";
import { IPlainRTCSocketMessageDTO } from "../dtos/socket.dto";
import { PlainRTCSocketMessageType } from "../enums/socket.enum";
import { LocalStorageEnum } from "../../shared/enums";
import {
  IDataChannelCaption,
  IPlainRTCDataMessage,
} from "../dtos/data-channel";
import { PlainRTCDataMessageType } from "../enums/data-channel";
import { modifySDPForBandwidth, preferVP8Codec } from "../../utils/rtc";
import { restaurant } from "ionicons/icons";
import { ICallRoom } from "../interfaces/call";
import { IConnectedSocketUsersRecord } from "../interfaces/socket-user";
import { PaymentDTO } from "../../payment/dtos/payment.dto";
import { PaymentPurpose } from "../../payment/enums/payment.enum";
import { UserRoutes } from "../../user/enums/routes.enum";
import { BookingRoutes } from "../../Booking/enums/routes";
import { useIonRouter } from "@ionic/react";

export const incomingAudio = "/audios/incoming.mp3";
export const callingAudio = "audios/calling.mp3";
export const callendAudio = "/audios/callend.mp3";

export interface IRoomInfo {
  roomId: string;
  roomType: RoomType;
  callType?: CallType;
}

export interface IPlainRTCContext {
  socketRef: MutableRefObject<Socket | null>;
  mediaState: IMediaState;
  callReceiver: (
    dto: ICallMetaData & { peerSocketId: string }
  ) => Promise<boolean>;
  answerCall: (
    dto: { peerSocketId: string },
    rtcOfferSdp: string
  ) => Promise<Boolean>;
  socketLoaded: boolean;
  callState: CallState;
  peerCallStage: CallStage;
  setCallState: Dispatch<SetStateAction<CallState>>;
  endCall: () => Promise<void>;
  incomingPeerUserRef: MutableRefObject<IPlainRTCConnectedUser | null>;
  calleePeerUserRef: MutableRefObject<IPlainRTCConnectedUser | null>;
  roomUsers: IPlainRTCConnectedUser[];
  userMediaStreamRef: MutableRefObject<MediaStream | null | undefined>;
  toggleMediaState: (mediaKind: "audio" | "video") => void;
  captions: IDataChannelCaption[];
  setOpenCaptionsOverlay: Dispatch<SetStateAction<boolean>>;
  openCaptionsOverlay: boolean;
  roomInfoRef: MutableRefObject<ICallMetaData | null>;
  openAuthOverlay: boolean;
  setOpenAuthOverlay: Dispatch<SetStateAction<boolean>>;
  connectedUsersRecord: IConnectedSocketUsersRecord; 
}

const plainRTCContext = createContext<IPlainRTCContext>(
  {} as unknown as IPlainRTCContext
);

export const PlainRTCContextProvider = ({ children }: PropsWithChildren) => {
  const router = useIonRouter();
  
  const { presentToastMessage } = usePresentToast();
  const { playAudio, stopAudio } = useAudioPlay();

  const localUer = localStorage.getItem(LocalStorageEnum.USER);
  const user: IAuthUserProfile = localUer
    ? JSON.parse(localUer)
    : { userId: `${Date.now}`, userName: `USER-${Date.now}` };

  const [ connectedUsersRecord, setConnectedUsersRecord] = useState<IConnectedSocketUsersRecord>({
    totalAidServiceProfiles: 0,
    totalUsers: 0
  });
  

  const callQualityRef = useRef<CallQuality>(CallQuality.LOW);
  const socketRef = useRef<Socket | null>(null);
  const incomingPeerUserRef = useRef<IPlainRTCConnectedUser | null>(null);
  const calleePeerUserRef = useRef<IPlainRTCConnectedUser | null>(null);
  const roomUsersRef = useRef<IPlainRTCConnectedUser[]>([]);
  const userMediaStreamRef = useRef<MediaStream | null>(null);
  const roomInfoRef = useRef<ICallMetaData | null>(null);
  const callRoomInfoRef = useRef<ICallRoom | null>(null);
  const captionsRef = useRef<IDataChannelCaption[]>([]);
  const callWaitTimerRef = useRef<unknown>(null);
  const callEndTimerRef = useRef<unknown>(null);

  const [openAuthOverlay, setOpenAuthOverlay] = useState(false);
  const [roomUsers, setRoomUsers] = useState<IPlainRTCConnectedUser[]>([]);
  const [callState, setCallState] = useState<CallState>(CallState.NONE);
  const [peerCallStage, setPeerCallStage] = useState<CallStage>(CallStage.NONE);
  const [mediaState, setMediaState] = useState<IMediaState>({} as IMediaState);
  const [reconnect, setReconnect] = useState<boolean>(false);
  const [socketLoaded, setSocketLoaded] = useState<boolean>(false);

  const [openCaptionsOverlay, setOpenCaptionsOverlay] =
    useState<boolean>(false);
  const [captions, setCaptions] = useState<IDataChannelCaption[]>([]);

  const streamOptions = {
    video:
      callQualityRef.current === CallQuality.HIGH
        ? true
        : {
            width: { ideal: 320 },
            height: { ideal: 240 },
            frameRate: { ideal: 15, max: 20 },
          },
    audio: true,
  };

  const handleAsyncError = (error: unknown, message = "") => {
    console.log(`${message}:`, (error as Error).message);
    presentToastMessage((error as Error).message);
  };

  const updateCaptions = (caption: IDataChannelCaption) => {
    captionsRef.current.push(caption);
    captionsRef.current =
      captionsRef.current.length > 50
        ? captionsRef.current.slice(50)
        : captionsRef.current;
    setCaptions(captionsRef.current);
  };
  const handleDataChannelMessage = async (dataChannelMessage: string) => {
    try {
      const dataMsg = JSON.parse(dataChannelMessage);
      if (dataMsg.messageType === PlainRTCDataMessageType.CAPTION) {
        updateCaptions(dataMsg.message as IDataChannelCaption);
      }
    } catch (error) {
      handleAsyncError(error);
    }
  };

  const initOrUpdateCallRoom = (
    dto: ICallMetaData,
    callMember: { userId: string; userName: string },
    config: { isCaller: boolean }
  ) => {
    //update callRoom
    if (callRoomInfoRef.current) {
      callRoomInfoRef.current.callMembers.push(callMember);
    } else {
      callRoomInfoRef.current = {
        ...dto,
        startTime: 0,
        endTime: 0,
        callMembers: [callMember],
        answered: false,
        initiatedBy: config.isCaller
          ? (user.userId as string)
          : (dto.userId as string),
      } as ICallRoom;
    }
  };
  const handleSocketMessage = async (
    msg: IPlainRTCSocketMessageDTO<unknown>
  ) => {
    if (msg.messageType === PlainRTCSocketMessageType.OFFER) {
      try {
        const msgBody = msg.message as IPlainRTCCallSDPDTO;
        roomInfoRef.current = { ...msgBody.metadata };

        const peerUserIndex = roomUsersRef.current.findIndex(
          (usr) => usr.socketId === msgBody.metadata.socketId
        );
        const callerDto: IPlainRTCConnectedUser = {
          ...msgBody.metadata,
          rtcOffer: msgBody.sdp,
        };

        if (peerUserIndex === -1) {
          const pc = await initPeer(callerDto.socketId as string, {
            roomId: callerDto.roomId,
            roomType: callerDto.roomType as RoomType,
          });
          if (!pc) throw new Error("Error creating RTC during offer");

          const dataChannel = pc.createDataChannel(`msg${callerDto.socketId}`);
          dataChannel.onmessage = (event) => {
            handleDataChannelMessage(event.data);
          };
          dataChannel.onerror = (event) => {
            handleAsyncError(event, "Error in data connection");
          };
          dataChannel.onclose = () => {
            console.log("Data channel closed");
          };

          callerDto.plainRTCConnection = pc;
          callerDto.dataChannel = dataChannel;
          roomUsersRef.current.push(callerDto);
        } else if (!roomUsersRef.current[peerUserIndex]?.rtcOffer)
          roomUsersRef.current[peerUserIndex].rtcOffer = msgBody.sdp;

        //-- UNSET CALLEE USER TO SET INCOMING USER
        calleePeerUserRef.current = null;
        incomingPeerUserRef.current =
          peerUserIndex === -1
            ? roomUsersRef.current[roomUsersRef.current.length - 1]
            : roomUsersRef.current[peerUserIndex];
        console.log("OFFER METADATA", msgBody.metadata);

        await getUserLocalMedia();
        playAudio(incomingAudio);
        setPeerCallStage(CallStage.DIALING_IN);

        initOrUpdateCallRoom(
          msgBody.metadata,
          {
            userId: msgBody.metadata.userId as string,
            userName: msgBody.metadata.userName as string,
          },
          { isCaller: false }
        );
        updateCallState(
          {
            callState: UserCallState.INCOMING,
            roomId: msgBody.metadata.roomId,
            roomType: msgBody.metadata.roomType,
          },
          callerDto.socketId
        );
      } catch (error) {
        throw new Error(`Error in Offer event: ${(error as Error).message}`);
      }
    }

    if (msg.messageType === PlainRTCSocketMessageType.ANSWER) {
      try {
        stopAudio();
        const msgBody = msg.message as IPlainRTCCallSDPDTO;
        const peerUserIndex = roomUsersRef.current?.findIndex(
          (usr) => usr.socketId === msgBody.metadata.socketId
        );
        if (peerUserIndex === -1) throw new Error("User does not exist");
        const peerUser = roomUsersRef.current[peerUserIndex];
        if (!peerUser?.plainRTCConnection)
          throw new Error("User peer connection not found");

        peerUser.plainRTCConnection.setRemoteDescription(
          new RTCSessionDescription({ type: "answer", sdp: msgBody.sdp })
        );

        if (roomUsersRef.current[peerUserIndex].pendingIceCandidates?.length) {
          console.log(
            "PENDING GANDIDATES",
            roomUsersRef.current[peerUserIndex].pendingIceCandidates?.length
          );
          for (const candidate of roomUsersRef.current[peerUserIndex]
            .pendingIceCandidates) {
            await roomUsersRef.current[
              peerUserIndex
            ]?.plainRTCConnection?.addIceCandidate(candidate);
          }
        }
      } catch (error) {
        throw new Error(`Error in Answer event: ${(error as Error).message}`);
      }
    }

    if (msg.messageType === PlainRTCSocketMessageType.ICECANDIDATE) {
      try {
        const msgBody = msg.message as IPlainRTCCallICECandidateDTO;
        console.log("CANDIDAE 2 EV", msgBody.candidate);
        const peerUserIndex = roomUsersRef.current?.findIndex(
          (usr) => usr.socketId === msgBody.metadata.socketId
        );
        if (peerUserIndex === -1) throw new Error("User does not exist");
        const peerUser = roomUsersRef.current[peerUserIndex];

        if (!peerUser?.plainRTCConnection)
          throw new Error("User peer connection not found");
        if (
          peerUser.plainRTCConnection?.remoteDescription &&
          peerUser.plainRTCConnection?.remoteDescription?.type
        ) {
          await peerUser.plainRTCConnection.addIceCandidate(
            new RTCIceCandidate(msgBody.candidate)
          );
        } else {
          (roomUsersRef.current[peerUserIndex].pendingIceCandidates || []).push(
            new RTCIceCandidate(msgBody.candidate)
          );
        }
      } catch (error) {
        throw new Error(`Candidate event: ${(error as Error).message}`);
      }
    }

    if (msg.messageType === PlainRTCSocketMessageType.USER_UPDATE) {
      const msgBody = msg.message as IPlainRTCConnectedUser;
      const peerUserIndex = roomUsersRef.current?.findIndex(
        (usr) => usr.socketId === msgBody.socketId
      );
      if (peerUserIndex === -1) console.log("User not found for update");
      else {
        roomUsersRef.current[peerUserIndex] = {
          ...roomUsersRef.current[peerUserIndex],
          ...(msgBody || {}),
        };
      }
      setRoomUsers([...roomUsersRef.current]);
    }

    if (msg.messageType === PlainRTCSocketMessageType.CALL_STATE) {
      const msgBody = msg.message as IPlainRTCConnectedUser;
      if (msgBody.callState === UserCallState.INCOMING)
        setPeerCallStage(CallStage.RINGING);
      if (
        msgBody.callState === UserCallState.NONE ||
        msgBody.callState === UserCallState.DROPPED
      ) {
        console.log("Remote peer ended call");
        if (
          msgBody.roomType === RoomType.PEER_TO_PEER ||
          roomInfoRef.current?.roomType === RoomType.PEER_TO_PEER
        ) {
          setPeerCallStage(CallStage.DROPPED);
          playAudio(callendAudio, false);
          const timeout = setTimeout(stopAudio, 3000);
          callEndTimerRef.current = timeout;
        }
        handleCallClosure(msgBody.socketId as string);
      }
    }

    if (msg.messageType === PlainRTCSocketMessageType.CONNECTION_STATE) {
      const msgBody = msg.message as {
        connectionState: IceConnectionState;
        socketId: string;
      };
      console.log("Peer connection event", msgBody);
      if (
        msgBody.connectionState === IceConnectionState.FAILED ||
        msgBody.connectionState === IceConnectionState.CLOSED
      ) {
        handleCallClosure(msgBody.socketId);
      }
    }
  };

  const answerCall = async (
    answeringDto: { peerSocketId: string },
    rtcOfferSdp: string
  ): Promise<Boolean> => {
    try {
      stopAudio();
      if (!rtcOfferSdp) throw new Error("No offer sdp provided to be answered");
      if (!roomInfoRef.current)
        throw new Error("Room context info not set yet");
      const dto = roomInfoRef.current;

      const peerUserIndex = roomUsersRef.current.findIndex(
        (usr) => usr.socketId === answeringDto.peerSocketId
      );

      const peerConnection =
        peerUserIndex !== -1 &&
        roomUsersRef.current[peerUserIndex].plainRTCConnection
          ? roomUsersRef.current[peerUserIndex].plainRTCConnection
          : await initPeer(answeringDto.peerSocketId, dto);
      if (!peerConnection) throw new Error("PC Init failed on offer");
      const stream = await getUserLocalMedia();
      if (!stream) throw new Error("Unabe to get user local stream");
      stream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, stream);
      });

      await peerConnection.setRemoteDescription(
        new RTCSessionDescription({ type: "offer", sdp: rtcOfferSdp })
      );
      if (roomUsersRef.current[peerUserIndex].pendingIceCandidates?.length) {
        for (const candidate of roomUsersRef.current[peerUserIndex]
          .pendingIceCandidates) {
          await peerConnection.addIceCandidate(candidate);
        }
      }
      const answer = await peerConnection.createAnswer();
      const modifiedSdp =
        callQualityRef.current === CallQuality.VERY_LOW
          ? modifySDPForBandwidth(answer.sdp as string, callQualityRef.current)
          : (answer.sdp as string);

      await peerConnection.setLocalDescription(answer);

      if (peerUserIndex === -1)
        roomUsersRef.current.push({
          ...dto,
          socketId: answeringDto.peerSocketId,
          plainRTCConnection: peerConnection,
        });
      else if (!roomUsersRef.current[peerUserIndex]?.plainRTCConnection)
        roomUsersRef.current[peerUserIndex].plainRTCConnection = peerConnection;
      const answerDto: IPlainRTCSocketMessageDTO<IPlainRTCCallSDPDTO> = {
        peerSocketId: answeringDto.peerSocketId,
        messageType: PlainRTCSocketMessageType.ANSWER,
        message: {
          sdp: modifiedSdp,
          sdpType: SDPType.ANSWER,
          receiverSocketId: answeringDto.peerSocketId,
          metadata: {
            ...dto,
            userId: user?.userId,
            socketId: socketRef.current?.id,
          },
        },
      };
      socketRef.current?.emit(
        BroadcastEvents.PLAIN_RTC_CALL_MESSAGE,
        answerDto
      );
      return true;
    } catch (error) {
      handleAsyncError(error, "Error answering call");
      return false;
    }
  };

  const joinGroupCall = useCallback(
    (dto: ICallMetaData) => {
      const handler = async () => {
        try {
          const usersInRoom: IApiResponse<IPlainRTCConnectedUser[]> =
            await new Promise((resolve) => {
              socketRef.current?.emit(
                BroadcastEvents.GET_ROOM_USERS,
                { roomId: dto.roomId },
                resolve
              );
            });
          if (usersInRoom.error) throw new Error(`${usersInRoom.error}`);
          if (usersInRoom.data) {
            //-- call only users that are not already in call room
            const usersToCall = usersInRoom.data.filter(
              (usr) =>
                !roomUsersRef.current.find(
                  (rUsr) => rUsr.socketId === usr?.socketId
                )
            );

            usersToCall.forEach((usr) => {
              callReceiver({
                peerSocketId: usr.socketId as string,
                roomId: dto.roomId,
                roomType: RoomType.CONFERENCE,
                callPurpose: dto.callPurpose,
                callType: dto.callType,
              });
            });
          }
        } catch (error) {
          console.log("Error ansering group call", (error as Error).message);
        }
      };
      handler();
    },
    [roomUsers, callState]
  );

  const endCall = useCallback(async () => {
    try {
      stopAudio();
      if (callWaitTimerRef.current)
        clearTimeout(callWaitTimerRef.current as number);
      if (callEndTimerRef.current)
        clearTimeout(callEndTimerRef.current as number);

      userMediaStreamRef.current?.getTracks().forEach((track) => {
        track.stop();
      });

      roomUsersRef.current?.forEach((usr) => {
        usr?.dataChannel?.close();
        usr.plainRTCConnection
          ?.getSenders()
          .forEach((sender) => usr.plainRTCConnection?.removeTrack(sender));
        usr?.plainRTCConnection?.close();
        usr.plainRTCConnection = null as unknown as RTCPeerConnection;
      });

      if (callRoomInfoRef.current) {
        callRoomInfoRef.current.endTime = Date.now();
        callRoomInfoRef.current.callMembers.push({
          userId: user.userId as string,
          userName: user.firstName as string,
        });
        const localHistory = localStorage.getItem(
          LocalStorageEnum.CALL_HISTORY
        );
        const callHistory: ICallRoom[] =
          localHistory == undefined ? [] : JSON.parse(localHistory);
        callHistory.push(callRoomInfoRef.current);
        localStorage.setItem(
          LocalStorageEnum.CALL_HISTORY,
          JSON.stringify(callHistory)
        );
        if (callRoomInfoRef.current.initiatedBy === user.userId) {
          const callRegisterUrl =
            roomInfoRef.current?.callPurpose === callPurpose.AID_SERVICE
              ? `${APIBaseURL}/call-room/aid-service`
              : `${APIBaseURL}/call-room/`;
          const res = await postData(callRegisterUrl, {
            method: "post",
            ...(callRoomInfoRef.current || {}),
          });
          console.log("RES FROM CALL UPLOAD", res);
        }
      }
      await cleanUpCallRoom(roomInfoRef.current?.roomId);
    } catch (error) {
      console.log("Error dropping call", (error as Error).message);
    }
  }, [callState]);

  const initSocket = useCallback(async (): Promise<Socket | undefined> => {
    try {
      return new Promise((resolve, reject) => {
        const socket = io(`${socketIOBaseURL}`);

        socket.on(BroadcastEvents.PLAIN_RTC_CALL_MESSAGE, handleSocketMessage);
        socketRef.current = socket;
        socket.on("connect", () => {
          const { userId, firstName: userName } = user;
          const dto: IPlainRTCConnectedUser = {
            userId,
            userName,
            socketId: socket.id,
          };
          socket.emit(BroadcastEvents.INIT_CONNECTED_USER, dto);
          resolve(socket);
        });
        socket.on(BroadcastEvents.UPDATE_CONNECTED_USERS_RECORD, (res: IApiResponse<IConnectedSocketUsersRecord>) => {
         setConnectedUsersRecord(res.data as IConnectedSocketUsersRecord)
        });
        socket.on(BroadcastEvents.PAYMENT_COMPLETION, (data: PaymentDTO & {id: number}) => {
          if(data.paymentPurpose === PaymentPurpose.FUND_DEPOSIT) router.push(UserRoutes.PROFILE);
          else if(data.paymentPurpose === PaymentPurpose.SERVICE_PAYMENT) router.push(`${BookingRoutes.INVOICE}?bi=${data.id}`)
        })

        socket.on("connect_error", reject);
        socket.on("disconnect", () => setReconnect(!reconnect));
        socketRef.current = socket;
      });
      
    } catch (error) {
      handleAsyncError(error, "Error initializing socket");
    }
  }, []);

  const cleanUpCallRoom = async (roomId?: string) => {
    try {
      userMediaStreamRef.current?.getTracks().forEach((track) => {
        track.stop();
      });
      userMediaStreamRef.current = null;
      roomUsersRef.current = [];
      setRoomUsers([]);
      roomInfoRef.current = null;
      setMediaState({});
      incomingPeerUserRef.current = null;
      calleePeerUserRef.current = null;
      setPeerCallStage(null as unknown as CallStage);
      callRoomInfoRef.current = null;

      const dto: IPlainRTCConnectedUser = {
        callState: UserCallState.NONE,
        socketId: socketRef.current?.id as string,
      };
      updateCallState(dto, roomId);
    } catch (error) {
      console.log("Error cleaning up call room", (error as Error).message);
    }
  };

  const updateCallState = useCallback(
    (
      userCallStatusDto: {
        callState?: UserCallState;
        roomId?: string;
        roomType?: RoomType;
      },
      socketOrRoomToNotify?: string
    ) => {
      socketRef.current?.emit(
        BroadcastEvents.UPDATE_USER_CALL_STATUS,
        userCallStatusDto
      );

      if (socketOrRoomToNotify) {
        const msgDto: IPlainRTCSocketMessageDTO<{
          socketId: string;
          callState: UserCallState;
        }> = {
          peerSocketId: socketOrRoomToNotify,
          roomId: socketOrRoomToNotify,
          messageType: PlainRTCSocketMessageType.CALL_STATE,
          message: {
            callState: userCallStatusDto.callState as UserCallState,
            socketId: socketRef.current?.id as string,
          },
        };
        socketRef.current?.emit(BroadcastEvents.PLAIN_RTC_CALL_MESSAGE, msgDto);
      }
      setCallState(userCallStatusDto.callState as unknown as CallState);
    },
    []
  );

  const getUserLocalMedia =
    useCallback(async (): Promise<MediaStream | null> => {
      try {
        if (roomInfoRef.current?.callType === CallType.AUDIO)
          streamOptions.video = false;
        const stream = userMediaStreamRef.current
          ? userMediaStreamRef.current
          : await (
              navigator.mediaDevices ||
              ((navigator as any).webkitMediaDevices as MediaDeviceInfo)
            ).getUserMedia({
              video: streamOptions.video,
              audio: streamOptions.audio,
            });
        userMediaStreamRef.current = stream;

        return userMediaStreamRef.current;
      } catch (error) {
        console.log("Error setting user media", (error as Error).message);
        return null;
      }
    }, []);

  const toggleMediaState = useCallback(
    (mediaKind: "video" | "audio") => {
      if (!userMediaStreamRef.current)
        return presentToastMessage("Your media is not ready yet");

      const currentVideoState = Boolean(
        userMediaStreamRef.current?.getVideoTracks()[0].enabled
      );
      const currentAudioState = Boolean(
        userMediaStreamRef.current?.getAudioTracks()[0].enabled
      );

      if (mediaKind === "audio") {
        userMediaStreamRef.current.getAudioTracks()[0].enabled =
          !currentAudioState;
        setMediaState({
          ...(mediaState || {}),
          isAudioTurnedOff: currentAudioState,
        });
      } else if (mediaKind === "video") {
        userMediaStreamRef.current.getVideoTracks()[0].enabled =
          !currentVideoState;
        setMediaState({
          ...(mediaState || {}),
          isVideoTurnedOff: currentVideoState,
        });
      }

      const isAudioTurnedOff =
        mediaKind === "audio" ? currentAudioState : mediaState.isAudioTurnedOff;
      const isVideoTurnedOff =
        mediaKind === "video" ? currentVideoState : mediaState.isAudioTurnedOff;

      const updateUserDto: IPlainRTCSocketMessageDTO<IPlainRTCConnectedUser> = {
        roomId: roomInfoRef.current?.roomId,
        peerSocketId: roomInfoRef.current?.roomId as string,
        messageType: PlainRTCSocketMessageType.USER_UPDATE,
        message: {
          socketId: socketRef.current?.id,
          isAudioTurnedOff,
          isVideoTurnedOff,
        },
      };
      socketRef.current?.emit(
        BroadcastEvents.PLAIN_RTC_CALL_MESSAGE,
        updateUserDto
      );
    },
    [mediaState]
  );

  const handleNewPeerStream = (
    stream: MediaStream,
    peerSocketId: string,
    peerConnection?: RTCPeerConnection
  ) => {
    try {
      console.log("STREAM", stream);
      const newUserIndex = roomUsersRef.current?.findIndex(
        (usr) => usr?.socketId === peerSocketId
      );

      if (newUserIndex === -1) throw new Error("User not found");

      roomUsersRef.current[newUserIndex].mediaStream = stream;
      if (peerConnection)
        roomUsersRef.current[newUserIndex].plainRTCConnection = peerConnection;

      setRoomUsers([...roomUsersRef.current]);
      //-- if user is not the initiator; join room
      const dto: IPlainRTCConnectedUser = {
        roomId: roomInfoRef.current?.roomId,
        roomType: roomInfoRef.current?.roomType,
        callState: CallState.ONGOING as unknown as UserCallState,
      };
      updateCallState(dto);
    } catch (error) {
      console.log("Error handling new peer stream", (error as Error).message);
    }
  };

  const handleCallClosure = (
    peerSocketId: string,
    call?: RTCPeerConnection
  ) => {
    if (roomInfoRef.current?.roomType === RoomType.PEER_TO_PEER) {
      endCall();
      return;
    }

    const peerUser = roomUsersRef.current.find(
      (usr) => usr?.socketId === peerSocketId
    );

    roomUsersRef.current = roomUsersRef.current.filter(
      (usr) => usr?.socketId !== peerSocketId
    );
    setRoomUsers([...roomUsersRef.current]);
    call = call ? call : peerUser?.plainRTCConnection;
    if (call && call.connectionState === IceConnectionState.CONNECTED) {
      peerUser?.dataChannel?.close();
      peerUser?.plainRTCConnection
        ?.getSenders()
        .forEach((sender) => peerUser?.plainRTCConnection?.removeTrack(sender));
      call.close();
    }
    return;
  };

  const initPeer = useCallback(
    async (
      remotePeerSocketId: string,
      roomInfo: { roomId?: string; roomType: RoomType } = {
        roomId: user.userId,
        roomType: RoomType.PEER_TO_PEER,
      }
    ): Promise<RTCPeerConnection | null> => {
      try {
        const dto: InitPlainRTCCallDTO = {
          receiverSocketId: remotePeerSocketId,
          metadata: {
            userId: user?.userId,
            userName: user?.userId,
            socketId: socketRef.current?.id,
            ...roomInfo,
          } as ICallMetaData,
        };
        const { receiverSocketId, metadata } = dto;
        const peerConnection = new RTCPeerConnection({
          iceServers: [
            { urls: "stun:stun.l.google.com:19302" },
            {
              urls: "turn:192.168.43.219:3478",
              username: "webrtcuser",
              credential: "thanks2025",
            },
          ],
          iceTransportPolicy: "all",
        });
        peerConnection.onicecandidate = (event) => {
          console.log("ICE CANDIDAT EVENT", event.candidate);
          if (event.candidate && socketRef.current) {
            const candidateDto: IPlainRTCCallICECandidateDTO = {
              receiverSocketId,
              metadata,
              candidate: event.candidate,
            };
            const msgDto: IPlainRTCSocketMessageDTO<IPlainRTCCallICECandidateDTO> =
              {
                peerSocketId: remotePeerSocketId,
                messageType: PlainRTCSocketMessageType.ICECANDIDATE,
                message: candidateDto,
              };
            socketRef.current.emit(
              BroadcastEvents.PLAIN_RTC_CALL_MESSAGE,
              msgDto
            );
          }
        };

        peerConnection.ontrack = (event) => {
          console.log("ON TRACK EVENT", event.streams?.length);
          handleNewPeerStream(
            event.streams[0],
            remotePeerSocketId,
            peerConnection
          );
        };

        peerConnection.oniceconnectionstatechange = (event) => {
          console.log("ICE state:", peerConnection.iceConnectionState);
        };

        peerConnection.onconnectionstatechange = () => {
          console.log("Connection state:", peerConnection.connectionState);

          const eventType =
            peerConnection.connectionState as IceConnectionState;
          if (eventType === IceConnectionState.DISCONNECTED)
            setPeerCallStage(CallStage.RECONNECTING);

          const peerUser = roomUsersRef.current.find(
            (usr) => usr?.socketId === remotePeerSocketId
          );
          if (!peerUser) return;

          if (eventType === IceConnectionState.CONNECTED) {
            if (callRoomInfoRef.current) {
              callRoomInfoRef.current.startTime =
                callRoomInfoRef.current.startTime || Date.now();
              callRoomInfoRef.current.answered = true;
            }
          }
          if (
            eventType === IceConnectionState.CLOSED ||
            eventType === IceConnectionState.FAILED
          ) {
            handleCallClosure(peerUser?.socketId as string, peerConnection);
          }

          const connectionStateDto: IPlainRTCSocketMessageDTO<{
            connectionState: IceConnectionState;
            socketId: string;
          }> = {
            messageType: PlainRTCSocketMessageType.CONNECTION_STATE,
            message: {
              connectionState: eventType,
              socketId: socketRef.current?.id as string,
            },
            peerSocketId: peerUser.socketId as string,
            roomId: roomInfoRef.current?.roomId,
          };
          socketRef.current?.emit(
            BroadcastEvents.PLAIN_RTC_CALL_MESSAGE,
            connectionStateDto
          );
        };
        return peerConnection;
      } catch (error) {
        handleAsyncError(error, "Error init plain rtc");
        return null;
      }
    },
    []
  );

  const callReceiver = async (
    dto: ICallMetaData & { peerSocketId: string }
  ): Promise<boolean> => {
    try {
      if (dto.peerSocketId === socketRef.current?.id)
        throw new Error("You can not call yourself");
      const { peerSocketId, ...callMetadata } = dto;
      roomInfoRef.current = callMetadata;

      const userConnectionData: IApiResponse<IPlainRTCConnectedUser> =
        await new Promise((resolve) => {
          socketRef.current?.emit(
            BroadcastEvents.GET_CONNECTED_USER,
            { socketId: peerSocketId },
            resolve
          );
        });

      if (userConnectionData.error || !userConnectionData.status)
        throw new Error(`${userConnectionData.error}`);
      const userData = userConnectionData.data;

      initOrUpdateCallRoom(
        { ...callMetadata },
        {
          userId: userData?.userId as string,
          userName: userData?.userName as string,
        },
        { isCaller: true }
      );

      if (
        userData?.callState === UserCallState.ONGOING &&
        userData.roomType === RoomType.PEER_TO_PEER
      )
        throw new Error("User busy");
      if (
        userData?.callState === UserCallState.ONGOING &&
        userData.roomType === RoomType.CONFERENCE &&
        userData?.roomId !== callMetadata.roomId
      )
        throw new Error("User busy");

      //-- UNSET INCOMING USER TO SET CALLEE
      incomingPeerUserRef.current = null;
      calleePeerUserRef.current = { ...userData };
      const stream = await getUserLocalMedia();
      if (!stream) throw new Error("Unable to get local stream");

      const pc = await initPeer(peerSocketId, callMetadata);
      if (!pc) throw new Error("No peer connection init");

      const sender = stream.getTracks().map((track) => {
        return pc.addTrack(track, stream);
      });

      if (callQualityRef.current === CallQuality.VERY_LOW) {
        sender.forEach((s) => {
          if (typeof s?.setParameters === "function") {
            const params = s.getParameters();
            if (!params.encodings) params.encodings = [{}];
            params.encodings[0].maxBitrate = 150 * 1000; // 150 kbps
            s.setParameters(params).catch(console.warn);
          }
        });
      }

      const dataChannel = pc.createDataChannel(`msg${dto.peerSocketId}`);
      dataChannel.onmessage = (event) => {
        console.log("DATA MESSAGE", event.data);
        handleDataChannelMessage(event.data);
      };
      dataChannel.onerror = (event) => {
        handleAsyncError(event, "Error in data connection");
      };
      dataChannel.onclose = () => {
        console.log("Data channel closed");
      };

      const offer = await pc.createOffer({ iceRestart: true });
      const modifiedSdp =
        callQualityRef.current === CallQuality.VERY_LOW
          ? modifySDPForBandwidth(offer.sdp as string, callQualityRef.current)
          : (offer.sdp as string);

      await pc.setLocalDescription(offer);

      const offerDto: IPlainRTCSocketMessageDTO<IPlainRTCCallSDPDTO> = {
        peerSocketId,
        messageType: PlainRTCSocketMessageType.OFFER,
        message: {
          receiverSocketId: peerSocketId,
          metadata: {
            ...dto,
            userId: user?.userId,
            userName: user?.firstName,
            socketId: socketRef.current?.id as string,
          },
          sdp: modifiedSdp,
          sdpType: SDPType.OFFER,
        },
      };
      socketRef.current?.emit(BroadcastEvents.PLAIN_RTC_CALL_MESSAGE, offerDto);

      roomUsersRef.current.push({
        ...userData,
        roomId: roomInfoRef.current?.roomId,
        roomType: roomInfoRef.current?.roomType,
        plainRTCConnection: pc,
        dataChannel,
      });

      if (roomInfoRef.current?.roomType === RoomType.PEER_TO_PEER)
        playAudio(callingAudio);

      updateCallState({
        callState: UserCallState.CALLING,
        roomId: dto.roomId,
        roomType: dto.roomType,
      });

      const timer = setTimeout(() => {
        if (
          roomUsersRef.current.length <= 1 &&
          !roomUsersRef.current[0]?.mediaStream
        ) {
          presentToastMessage("No answer");
          endCall();
        }
        return;
      }, 20000);
      callWaitTimerRef.current = timer;
      return true;
    } catch (error) {
      console.log("Error calling user", (error as Error).message);
      presentToastMessage((error as Error).message);
      stopAudio();
      if (dto.roomType === RoomType.PEER_TO_PEER) endCall();
      return false;
    }
  };

  useEffect(() => {
    if(!user.userId) setOpenAuthOverlay(true);

    else if(user.userId) initSocket()
      .then(() => setSocketLoaded(true))
      .catch((err) => console.log(err.message));
  }, []);

  const initPlainRTCContext: IPlainRTCContext = {
    socketRef,
    mediaState,
    peerCallStage,
    callReceiver,
    answerCall,
    socketLoaded,
    callState,
    setCallState,
    endCall,
    incomingPeerUserRef,
    calleePeerUserRef,
    roomUsers,
    userMediaStreamRef,
    toggleMediaState,
    captions,
    openCaptionsOverlay,
    setOpenCaptionsOverlay,
    roomInfoRef,
    openAuthOverlay,
    setOpenAuthOverlay,
    connectedUsersRecord
  };

  return (
    <plainRTCContext.Provider value={initPlainRTCContext}>
      {children}
    </plainRTCContext.Provider>
  );
};

export const usePlainRTCContextStore = () =>
  useContext<IPlainRTCContext>(plainRTCContext);
