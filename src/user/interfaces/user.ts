import { DataConnection, MediaConnection } from "peerjs";
import { IAuthUser } from "../../auth/components/LoginOrRegister";
import { CallType, RoomType } from "../../call/enums/call.enum";
import { UserCallState } from "../enums/user.enum";
import { IAidService, ICallAidServiceProfileDTO } from "../../aid-service/interfaces/aid-service.interface";
import { RoleDTO } from "../../auth/dtos/role.dto";
import { IProfileCluster } from "./cluster";
import { IProfileWallet } from "./user-wallet";
import { IAidServiceProfile } from "../../aid-service/interfaces/aid-service-profile";

export interface IConnectedUser {
  userId?: string;
  userName?: string;
  avatar?: string;
  socketId?: string;
  peerId?: string;
  callState?: UserCallState;
  roomId?: string;
  roomType?: RoomType;
  isVideoTurnedOff?: boolean;
  isAudioTurnedOff?: boolean;
  mediaStream?: MediaStream;
  mediaConnection?: MediaConnection;
  dataConnection?: DataConnection;
  trackId?: string;
  plainRTCConnection?: RTCPeerConnection;
  rtcOffer?: string
}

export interface IPlainRTCConnectedUser {
  userId?: string;
  userName?: string;
  avatar?: string;
  socketId?: string;
  callState?: UserCallState;
  roomId?: string;
  roomType?: RoomType;
  isVideoTurnedOff?: boolean;
  isAudioTurnedOff?: boolean;
  mediaStream?: MediaStream;
  plainRTCConnection?: RTCPeerConnection;
  rtcOffer?: string;
  pendingIceCandidates?: RTCIceCandidate[];
  dataChannel?: RTCDataChannel;
  callType?: CallType;
  aidServiceProfiles?: IAidServiceProfile[]
}

export interface IUser {
    id: number;
    userId: string;
    name: string;
}

export interface IProfile {
    id: number;
    userId: string;
    email?: string;
    phoneNumber?: string;
    firstName: string;
    lastName: string;
    avatar?: string;
    gender?: string;
    createdAt?: string;
    profileClusters?: IProfileCluster[];
    profileWallet?: IProfileWallet
    
}


export interface IAuthUserProfile extends IAuthUser {
    id?: number;
    userId?: string;
    role?: RoleDTO;
    firstName?: string;
    lastName?: string;
    profile?: IProfile;
    aidServices: IAidService[];
}

export interface ILoginResponse extends IAuthUserProfile{
    token?: string;
    refreshToken?: string;
}