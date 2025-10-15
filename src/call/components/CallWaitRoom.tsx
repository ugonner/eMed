import {
  IonCol,
  IonGrid,
  IonRow,
} from "@ionic/react";
import { callSharp, powerSharp } from "ionicons/icons";
import { usePlainRTCContextStore } from "../contexts/plainwebrtc";
import { CallVideo } from "./video/CallVideo";
import { CallState } from "../enums/call.enum";
import { RoundButton } from "../../shared/components";

export const CallWaitRoom = () => {
  const {
    endCall,
    answerCall,
    callState,
    incomingPeerUserRef,
    userMediaStreamRef,
  } = usePlainRTCContextStore();

  return (
    <>
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
        }}
      >
        <CallVideo mediaStream={userMediaStreamRef.current as MediaStream} />
        <div
          style={{
            position: "absolute",
            bottom: 20,
            left: 0,
            right: 0,
            opacity: 2,
          }}
        >
          {callState === CallState.INCOMING && (
            <div>
              <IonGrid>
                <IonRow>
                  <IonCol size="4">
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <RoundButton
                        onClick={() => {
                          answerCall(
                            {
                              peerSocketId: incomingPeerUserRef.current?.socketId as string,
                            },
                            incomingPeerUserRef.current?.rtcOffer as string
                          );
                        }}
                        ariaLabel="take call"
                        icon={callSharp}
                        label="take"
                      />
                    </div>
                  </IonCol>
                  <IonCol size="4"></IonCol>
                  <IonCol size="4">
                    <div
                      style={{
                        display: "flex",
                        alignContent: "center",
                        justifyContent: "center",
                      }}
                    >
                      <RoundButton
                        onClick={() => {
                          endCall();
                        }}
                        icon={powerSharp}
                        ariaLabel="Drop call"
                        label="end"
                        backgroundColor="red"
                      />
                    </div>
                  </IonCol>
                </IonRow>
              </IonGrid>
            </div>
          )}
          {callState === CallState.CALLING && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <RoundButton
                onClick={() => endCall()}
                ariaLabel="drop call"
                label="end"
                icon={powerSharp}
                backgroundColor="red"
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};
