import { App } from "@capacitor/app";
import { PropsWithChildren, useEffect } from "react";
import { AppBaseUrl } from "../../shared/api/base";
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
  IonRouterOutlet,
  IonRow,
} from "@ionic/react";
import { callSharp, closeCircle, powerSharp } from "ionicons/icons";
import { useRTCContextStore } from "../contexts/rtc";
import { CallStage, CallState, RoomType } from "../enums/call.enum";
import { ConsumingVideo } from "../components/video/ConsumingVideo";
import { CallVideo } from "../components/video/CallVideo";
import { usePlainRTCContextStore } from "../contexts/plainwebrtc";
import { Route } from "react-router";
import { ConnectedUsers } from "../pages/ConnectedUsers";
import ServiceHome from "../../home/components/QuickActions";
import { CallHistory } from "../pages/CallHistory";
import { LoginOrRegister } from "../../auth/components/LoginOrRegister";
import { CallRoom } from "../components/CallRoom";
import { CallWaitRoom } from "../components/CallWaitRoom";
import { CallRoutes } from "../enums/routes";
import { AuthGuard } from "../../auth/guards/AuthGuard";
import { BaseHeader } from "../../shared/components/partials/BaseHeader";
import { HomePage } from "../../home/pages/HomePage";

export const PlainRTCBaseLayout = ({ children }: PropsWithChildren) => {
  const {
    roomUsers,
    callState,
    setCallState,
    incomingPeerUserRef,
    calleePeerUserRef,
    peerCallStage,
    openAuthOverlay,
    setOpenAuthOverlay,
  } = usePlainRTCContextStore();

  useEffect(() => {
    try {
      App.addListener("appUrlOpen", (event) => {
        const routeUrl = event.url.replace(`${AppBaseUrl}/conference`, "");
        window.location.href = routeUrl;
      });
    } catch (error) {
      alert((error as Error).message);
    }
  }, []);

  return (
    <AuthGuard>
      <IonPage>
        <BaseHeader title="Service Connect" />
        <IonContent id="base-menu-content">
          <IonRouterOutlet>
            <Route path={CallRoutes.HOME} component={HomePage} />
            <Route
              path={CallRoutes.CONNECTED_USERS}
              component={ConnectedUsers}
            />
            <Route path={CallRoutes.CALL_HISTORY} component={CallHistory} />
          </IonRouterOutlet>

          <IonModal
            backdropDismiss={false}
            isOpen={callState !== CallState.NONE}
            onDidDismiss={() => setCallState(CallState.NONE)}
          >
            {roomUsers.length <= 1 && (
              <div className="ion-text-center">
                <h2>
                  {incomingPeerUserRef.current?.userName ||
                    calleePeerUserRef.current?.userName}
                </h2>
                <small>
                  {callState !== CallState.ONGOING &&
                  peerCallStage !== CallStage.NONE
                    ? peerCallStage
                    : ""}
                </small>
              </div>
            )}
            <div style={{ overflow: "auto" }}>
              {callState === CallState.ONGOING && <CallRoom />}
              {callState !== CallState.ONGOING && <CallWaitRoom></CallWaitRoom>}
            </div>
          </IonModal>
          <IonModal
            isOpen={openAuthOverlay}
            onDidDismiss={() => setOpenAuthOverlay(false)}
          >
            <LoginOrRegister onSuccess={() => setOpenAuthOverlay(false)} />
          </IonModal>
        </IonContent>
      </IonPage>
    </AuthGuard>
  );
};
