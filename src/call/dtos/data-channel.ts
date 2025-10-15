import { PlainRTCDataMessageType } from "../enums/data-channel";
import { PlainRTCSocketMessageType } from "../enums/socket.enum";

export interface IPlainRTCDataMessage<TMessageBody> {
    peerSocketId?: string;
    roomId?: string;
    messageType: PlainRTCDataMessageType;
    message: TMessageBody;
}

export interface IDataChannelCaption {
    text: string;
    senderSocketId: string;
    timestamp: number;
}