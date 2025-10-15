import { App } from "@capacitor/app";
import { PropsWithChildren, useEffect } from "react";
import { AppBaseUrl } from "../api/base";
import {
  IonButton,
  IonCol,
  IonContent,
  IonFab,
  IonFabButton,
  IonGrid,
  IonIcon,
  IonItem,
  IonLabel,
  IonModal,
  IonPage,
  IonRow,
} from "@ionic/react";
import { callSharp, closeCircle, powerSharp } from "ionicons/icons";
import { useRTCContextStore } from "../../call/contexts/rtc";
import { CallState } from "../../call/enums/call.enum";
import { ConsumingVideo } from "../../call/components/video/ConsumingVideo";
import { CallVideo } from "../../call/components/video/CallVideo";

export const RTCBaseLayout = ({ children }: PropsWithChildren) => {
  const {
    roomUsers,
    callState,
    setCallState,
    endCall,
    incomingCallRef,
    userMediaStreamRef,
  } = useRTCContextStore();

  useEffect(() => {
    try {
      App.addListener("appUrlOpen", (event) => {
        const routeUrl = event.url.replace(`${AppBaseUrl}`, "");
        window.location.href = routeUrl;
      });
    } catch (error) {
      alert((error as Error).message);
    }
  }, []);

  return (
    <IonPage>
      <IonContent>
        {children}

        <IonModal
          backdropDismiss={false}
          isOpen={callState !== CallState.NONE}
          onDidDismiss={() => setCallState(CallState.NONE)}
        >
          <div>
            <div>
              <IonGrid>
                <IonRow>
                  <IonCol size="12">
                    <IonItem>
                      <h1>
                        {callState} call from{" "}
                        {incomingCallRef.current?.peer || "My self"}
                      </h1>
                      <IonButton
                        onClick={() => setCallState(CallState.NONE)}
                        slot="end"
                        fill="clear"
                      >
                        <IonIcon icon={closeCircle}></IonIcon>
                      </IonButton>
                    </IonItem>
                  </IonCol>
                </IonRow>
                <IonRow>
                  <IonCol sizeSm="4" size="12"></IonCol>
                  <IonCol sizeSm="4" size="12">
                    <IonGrid>
                      {callState === CallState.ONGOING && (
                        <IonRow>
                          {roomUsers.map((usr, index) => (
                            <IonCol
                              key={index}
                              size={roomUsers.length === 1 ? "12" : "6"}
                            >
                              <ConsumingVideo producerUser={usr} />
                            </IonCol>
                          ))}
                          {roomUsers.length === 1 && (
                            <IonRow>
                              <IonCol size="12">
                                <div className="ion-text-center">
                                  <IonButton
                                    slot="end"
                                    onClick={() => {
                                      endCall(roomUsers)
                                        .then(() => {
                                          setCallState(CallState.NONE);
                                        })
                                        .catch((err) =>
                                          console.log(
                                            "Error dropping call",
                                            err.message
                                          )
                                        );
                                    }}
                                    color={"danger"}
                                  >
                                    <IonIcon
                                      size="large"
                                      color="danger"
                                      icon={callSharp}
                                    ></IonIcon>
                                    End Call
                                  </IonButton>
                                </div>
                              </IonCol>
                            </IonRow>
                          )}
                        </IonRow>
                      )}
                      {callState !== CallState.ONGOING && (
                        <IonRow>
                          <IonCol size="12">
                            <h1>Ok My video</h1>
                            <CallVideo
                              mediaStream={
                                userMediaStreamRef.current as MediaStream
                              }
                            />
                            {callState === CallState.CALLING ? (
                              <div>
                                <IonFab vertical="bottom" horizontal="center">
                                  <IonFabButton
                                    onClick={() => {
                                      endCall(roomUsers)
                                        .then(() => {
                                          setCallState(CallState.NONE);
                                        })
                                        .catch((err) =>
                                          console.log(
                                            "Error dropping call",
                                            err.message
                                          )
                                        );
                                    }}
                                    color={"danger"}
                                    aria-label="drop call"
                                  >
                                    <IonIcon
                                      size="large"
                                      color="danger"
                                      icon={powerSharp}
                                    ></IonIcon>
                                    <br />
                                    <IonLabel><small>End Call</small></IonLabel>
                                  </IonFabButton>
                                </IonFab>
                              </div>
                            ) : (
                              <div>
                                <IonItem>
                               <IonFab vertical="bottom" horizontal="start">
                                  <IonFabButton
                                    onClick={() => {
                                      endCall(roomUsers)
                                        .then(() => {
                                          setCallState(CallState.NONE);
                                        })
                                        .catch((err) =>
                                          console.log(
                                            "Error dropping call",
                                            err.message
                                          )
                                        );
                                    }}
                                    color={"danger"}
                                    aria-label="drop call"
                                  >
                                    <IonIcon
                                      size="large"
                                      color="danger"
                                      icon={powerSharp}
                                    ></IonIcon>
                                    <br />
                                    <IonLabel><small>End Call</small></IonLabel>
                                  </IonFabButton>
                                </IonFab>

                                    <IonFab vertical="bottom" horizontal="center">
                                  <IonFabButton
                                  onClick={() => {
                                      incomingCallRef.current?.answer(
                                        userMediaStreamRef.current as MediaStream
                                      );
                                    }}
                                    color={"primary"}
                                    aria-label="take call"
                                  >
                                    <IonIcon
                                      size="large"
                                      icon={callSharp}
                                    ></IonIcon>
                                    <br />
                                    <IonLabel><small>Pick up</small></IonLabel>
                                  </IonFabButton>
                                </IonFab>
                                </IonItem>
                              </div>
                            )}
                          </IonCol>
                          <IonCol size="12"></IonCol>
                        </IonRow>
                      )}
                    </IonGrid>
                  </IonCol>
                  <IonCol sizeSm="4" size="12"></IonCol>
                </IonRow>
              </IonGrid>
            </div>
          </div>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};
