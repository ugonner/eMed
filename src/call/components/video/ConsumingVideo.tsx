import {
  useEffect,
  useRef,
  useState,
  VideoHTMLAttributes,
} from "react";
import { IProducerUser } from "../../interfaces/socket-user";
import { userReactionsEmojis } from "../../../shared/DATASETS/user-reaction-emojis";
import { IConnectedUser } from "../../../user/interfaces/user";
import { usePlainRTCContextStore } from "../../contexts/plainwebrtc";
import { CallType } from "../../enums/call.enum";

export interface ICallVideoProps extends VideoHTMLAttributes<HTMLVideoElement> {
  producerUser?: IConnectedUser;
}

export const ConsumingVideo = ({ producerUser, ...videoProps }: ICallVideoProps) => {
  const {roomInfoRef} = usePlainRTCContextStore()
  const videoRef = useRef({} as HTMLVideoElement);
  
  useEffect(() => {
    if (producerUser?.mediaStream) {
      const videoElem = videoRef.current as HTMLVideoElement;
      if (videoElem) {
        videoElem.srcObject = producerUser.mediaStream;
        
      }
    }
  }, []);

  console.log("PRODUSER USER ISVIDEO TURNED OFF", producerUser?.isVideoTurnedOff);
  
  
  return (
    <div>
      {(producerUser?.isVideoTurnedOff || roomInfoRef.current?.callType === CallType.AUDIO) && (
        <div 
        style={{
          width: "100%",
          height:  "100%",
          objectFit: "cover",
          fontSize: "3em",
          textAlign: "center",
          justifyContent: "center",
          backgroundColor: "black",
          textTransform: "uppercase"
        }}
        >
          {(producerUser?.userName?.substring(0, 1)) || "NA"}
        </div>
      )}
      <video
        {...videoProps}
        width={"100%"}
        height={"auto"}
        ref={videoRef}
        autoPlay
        playsInline
        hidden={(producerUser?.isVideoTurnedOff || roomInfoRef.current?.callType === CallType.AUDIO)}
      ></video>
    </div>
  );
};
