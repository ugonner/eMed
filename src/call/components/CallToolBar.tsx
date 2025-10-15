import {
  IonButton,
  IonCol,
  IonGrid,
  IonIcon,
  IonRow,
} from "@ionic/react";
import {
  chatboxSharp,
  micOffSharp,
  micSharp,
  powerSharp,
  videocamOffSharp,
  videocamSharp,
} from "ionicons/icons";
import { MouseEventHandler } from "react";
import { usePlainRTCContextStore } from "../contexts/plainwebrtc";

export interface ICallToolbarItem {
  color?: string;
  label?: string;
  text: "end" | "mic" | "cam";
  icon: string;
}
export const CallToolBar = () => {
  const {
    endCall,
    toggleMediaState,
    mediaState,
    captions,
    openCaptionsOverlay,
    setOpenCaptionsOverlay,
  } = usePlainRTCContextStore();
  const items: ICallToolbarItem[] = [
    {
      text: "mic",
      label: "toggle audio",
      icon: mediaState.isAudioTurnedOff ? micOffSharp : micSharp,
    },
    {
      text: "cam",
      label: mediaState.isVideoTurnedOff ? "Turn on video" : "Turn off video",
      icon: mediaState.isVideoTurnedOff ? videocamOffSharp : videocamSharp,
    },
    {
      text: "end",
      label: "End call",
      icon: powerSharp,
      color: "brickred",
    },
  ];
  return (
    <IonGrid>
      <IonRow>
        <IonCol size="12">
          <div
            role="button"
            style={{ textAlign: "center", color: "white" }}
            onClick={() => setOpenCaptionsOverlay(!openCaptionsOverlay)}
            aria-label={
              openCaptionsOverlay ? "Turn off caption" : "Turn on captions"
            }
          >
            <span style={{ borderRadius: "50%" }}>
              <IonIcon icon={chatboxSharp} className="ion-margin"></IonIcon>
            </span>
            <br />
            <small>{openCaptionsOverlay ? "Off" : "On"}</small>
          </div>
        </IonCol>
      </IonRow>
      {openCaptionsOverlay && (
        <IonRow>
          <IonCol size="12">
             <h1>captions {captions.length}</h1>
            <div>
              {captions.map((caption, index) => (
                <span key={index}>{caption.text + " "}</span>
              ))}
            </div>
          </IonCol>
        </IonRow>
      )}
      <IonRow>
        {items.map((item, index) => (
          <IonCol key={index} size="4">
            <div className="ion-text-center">
              <div
                role="button"
                style={{
                  borderRadius: "50%",
                  background: item.color ? item.color : "transparent",
                }}
                aria-label={item.label}
                onClick={() => {
                  if (item.text === "cam") toggleMediaState("video");
                  else if (item.text === "mic") toggleMediaState("audio");
                  else if (item.text === "end") endCall();
                }}
                color={item.color}
              >
                <IonIcon
                  icon={item.icon}
                  size="large"
                  slot="icon-only"
                ></IonIcon>
              </div>
              <span>
                <small>{item.text}</small>
              </span>
            </div>
          </IonCol>
        ))}
      </IonRow>
    </IonGrid>
  );
};
