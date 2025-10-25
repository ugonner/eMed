import {
  IonAvatar,
  IonContent,
  IonFooter,
  IonItem,
  IonLabel,
  IonPage,
  IonToolbar,
  useIonRouter,
} from "@ionic/react";
import { useEffect } from "react";
import { useLocalStorage } from "../../utils";
import { IAppSettings } from "../../shared/interfaces/app-settings";
import { LocalStorageEnum } from "../../shared/enums";
import { HomeRoutes } from "../enums/routes";
import "./SplashView.css";

export const SplashPage = () => {
  const router = useIonRouter();
  const { getItem } = useLocalStorage();
  const appSettings = getItem<IAppSettings>(LocalStorageEnum.APP_SETTINGS);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (appSettings?.isOldUser) router.push(HomeRoutes.HOME);
      else router.push(HomeRoutes.ONBOARDING);
    }, 20000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <IonPage>
      <IonContent color={"dark"} fullscreen>
        <div
          style={{
            height: "100vh",
            width: "100%",
            position: "relative",
            backgroundColor: "#001",
            color: "#ffe"
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "40%",
              left: "10%",
              fontWeight: "bold",
            }}
          >
            <div style={{display: "flex", justifyContent: "center"}}>
             <div className="ion-margin-vertical">
                <img
                  src="/favicon.png"
                  alt="app logo"
                  className="splash-logo"
                />
             </div>
             <div className="ion-margin-horizontal splash-label">
                  <h2 style={{fontWeight: "bolder"}}>FlexMedCare<small>&trade;</small></h2>
                <h6>Bringing Healthcare closer to you</h6>
             </div>
            </div>
          </div>

          <div
            style={{
              position: "absolute",
              bottom: "2%",
              left: "10%",
              fontWeight: "bold",
              textAlign: "center"
            }}
          >
              <p className="ion-margin ion-text-center"> Powered By AppLawsIT&trade;</p>
            
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};
