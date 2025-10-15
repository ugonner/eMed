import { IceCandidate } from "mediasoup-client/lib/Transport";
import { callPurpose, CallType, RoomType, SDPType } from "../enums/call.enum";
import { IConnectedUser } from "../../user/interfaces/user";

 export interface IInitUserConnectionDTO {
    socketId?: string;
    peerId?: string;
    userId: string;
    userName?: string;
    avatar?: string;
 }

 export interface JoinRoomDTO {
    socketId?: string;
    peerId?: string;
    roomId: string;
    roomType?: RoomType;
 }

 export interface ICallMetaData extends IConnectedUser {
   roomId: string;
   roomType: RoomType;
   callType: CallType;
   callPurpose: callPurpose;
   aidServiceProfileId?: number;
 }

 export interface InitCallDTO {
   receiverPeerId: string;
   metadata: ICallMetaData
 }

 export interface InitPlainRTCCallDTO {
   receiverSocketId: string;
   metadata: ICallMetaData
 }

  export interface IPlainRTCCallICECandidateDTO extends InitPlainRTCCallDTO{
    candidate: RTCIceCandidate
 }

 export interface IPlainRTCCallSDPDTO extends InitPlainRTCCallDTO {
  sdp: string;
   sdpType: SDPType;
 }

