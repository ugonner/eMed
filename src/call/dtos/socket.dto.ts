import { PlainRTCSocketMessageType } from "../enums/socket.enum";

export interface IPlainRTCSocketMessageDTO<TMessageBody> {
    peerSocketId: string;
    roomId?: string;
    messageType: PlainRTCSocketMessageType;
    message: TMessageBody;
}