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
  useIonRouter,
} from "@ionic/react";
import { callSharp, closeCircle, powerSharp } from "ionicons/icons";
import { useRTCContextStore } from "../../call/contexts/rtc";
import { CallState } from "../../call/enums/call.enum";
import { ConsumingVideo } from "../../call/components/video/ConsumingVideo";
import { CallVideo } from "../../call/components/video/CallVideo";
import { useHistory } from "react-router";

export const BaseLayout = ({ children }: PropsWithChildren) => {
  const router = useIonRouter();
  const historyRouter = useHistory();
  useEffect(() => {
    try {
      App.addListener("appUrlOpen", (event) => {
        
        const routeUrl = event.url.replace(`${AppBaseUrl}`, "");
        window.location.href = routeUrl;
        //router.push(routeUrl, "forward");
       // historyRouter.push(routeUrl);
      });
    } catch (error) {
      alert((error as Error).message);
    }
  }, []);

  return (
    <>
    {children}
    </>
  );
};
