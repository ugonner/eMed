import { callPurpose, CallType, RoomType } from "../enums/call.enum";

export interface ICallMember {
    userId: string;
    userName: string;
}

export interface ICallRoom {
    id?: number;
    roomId: string;
    roomType: RoomType;
    startTime: number;
    endTime: number;
    callMembers: ICallMember[]
    initiatedBy: string;
    answered?: boolean;
    callPurpose: callPurpose;
    callType: CallType
    aidServiceProfileId?: number;
}