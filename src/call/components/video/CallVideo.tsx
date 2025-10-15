import {
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  VideoHTMLAttributes,
} from "react";
import { userReactionsEmojis } from "../../../shared/DATASETS/user-reaction-emojis";
import { IAuthUserProfile } from "../../../user/interfaces/user";
import { Socket } from "socket.io-client";
import { DataProducer } from "mediasoup-client/lib/DataProducer";
import { IProducerUser } from "../../interfaces/socket-user";
import { LocalStorageEnum } from "../../../shared/enums";
import { useRTCContextStore } from "../../contexts/rtc";
import { usePlainRTCContextStore } from "../../contexts/plainwebrtc";
import { CallType } from "../../enums/call.enum";

export interface ICallVideoProps extends VideoHTMLAttributes<HTMLVideoElement> {
  mediaStream: MediaStream;
  socket?: Socket;
  room?: string;
  dataProducer?: DataProducer;
}

export const CallVideo = (props: ICallVideoProps) => {
  const storedUser = localStorage.getItem(LocalStorageEnum.USER);
  const user: IAuthUserProfile = storedUser ? JSON.parse(storedUser) : {};
  let { mediaStream, socket, room, dataProducer, ...videoProps } = props;
  const { mediaState: {isVideoTurnedOff}, roomInfoRef} =
    usePlainRTCContextStore();

  const videoRef = useRef({} as HTMLVideoElement);
  
  
  
  useEffect(() => {
    const setUp = async () => {
      try {
        if (
          mediaStream?.getTracks &&
          mediaStream?.getTracks().length > 0
        ) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (error) {
        console.log("Error setting up call video", (error as Error).message);
      }
    };
    setUp();
  }, [mediaStream]);
  return (
    <div>
      {(isVideoTurnedOff || roomInfoRef.current?.callType === CallType.AUDIO) && (
        <div
         style={{
          width: "100%",
          height:  "90%",
          objectFit: "cover",
          textAlign: "center",
          justifyContent: "center",
          backgroundColor: "black",
          textTransform: "uppercase"
        }}
       >
        Me  
        </div>
      )}
      <video
        style={{ width: "100%", height: "auto" }}
        ref={videoRef}
        {...videoProps}
        autoPlay
        playsInline
        muted
        hidden={(isVideoTurnedOff || roomInfoRef.current?.callType === CallType.AUDIO)}
      ></video>

      
    </div>
  );
};
