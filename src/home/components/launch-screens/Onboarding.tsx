import {
  IonAvatar,
  IonButton,
  IonIcon,
  IonItem,
  useIonRouter,
} from "@ionic/react";
import {
  bandageSharp,
  carSharp,
  medkit,
  medkitSharp,
  peopleSharp,
} from "ionicons/icons";
import { DivIcon } from "leaflet";
import { useState } from "react";
import { HomeRoutes } from "../../enums/routes";
import { useLocalStorage } from "../../../utils";
import { IAppSettings } from "../../../shared/interfaces/app-settings";
import { LocalStorageEnum } from "../../../shared/enums";

export interface IOnboardingItem {
  label: string;
  header: string;
  icon: string;
}

const onboardingItems: IOnboardingItem[] = [
  {
    icon: medkitSharp,
    header: "Quality And Affordable",
    label:
      "Get quality health care service at your spot, book services at affordable rates",
  },
  {
    icon: carSharp,
    header: "Swift and Smart",
    label:
      "We get to your spot in a moment, good for your rapid response situations",
  },
  {
    icon: peopleSharp,
    header: "Borderless Healthcare",
    label:
      "Every community is covered, bringing quality heathcare virtully all locations",
  },
];
export const OnBoarding = () => {
  const { setItem, getItem } = useLocalStorage();

  const [pageNumber, setPageNumber] = useState(0);
  const item = onboardingItems[pageNumber];

  return (
    <div
      style={{
        textAlign: "center",
        textTransform: "capitalize",
        fontWeight: "bold",
        position: "relative",
        width: "100%",
        height: "100vh"
      }}
    >
      <h1 style={{ fontWeight: "bolder" }}>Welcome To FlexMedCare&trade;</h1>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignContent: "center",
        }}
      >
        {item && (
          <div>
            <div style={{ fontSize: "4em" }}>
              <IonIcon icon={item.icon}></IonIcon>
            </div>
            <h2 style={{ fontWeight: "bolder" }}>{item.header}</h2>
            <p>{item.label}</p>
          </div>
        )}
        {!item && (
          <div>
            <div style={{ fontSize: "2em" }}>
              <IonIcon icon={bandageSharp}></IonIcon>
            </div>
            <h2 style={{ fontWeight: "bolder" }}>Quick SOS</h2>
            <p>
              <b>In Danger?</b> Use the dedicated SOS button{" "}
              <IonIcon
                icon={medkit}
                className="ion-margin-horizontal"
              ></IonIcon>
              to quickly drop off an SOS alert for help.
            </p>
          </div>
        )}
      </div>
      <div>
        <p>
          By joining us, you agree to our Terms and Conditions at FlexMedCare
        </p>
      </div>
      <div
      className="ion-padding"
      style={{
        position: "absolute",
        bottom: "3%",
        left: "4$",
        width: "100%"
      }}>
        <div
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <div>
          {onboardingItems[pageNumber - 1] && (
            <span
            role="button"
              onClick={() => setPageNumber(pageNumber - 1)}
            >
              Back
            </span>
          )}
        </div>
        <div>
          {!item && (
            <IonButton
              shape="round"
              onClick={() => {
                let appSettings: IAppSettings | null = getItem<IAppSettings>(
                  LocalStorageEnum.APP_SETTINGS
                );
                appSettings = { ...(appSettings || {}), isOldUser: true };
                setItem(LocalStorageEnum.APP_SETTINGS, appSettings);
                window.location.href = HomeRoutes.HOME;
              }}
            >
              Get Started
            </IonButton>
          )}
        </div>

        <div>
            
            <span
            role="button"
              onClick={() => {
                if(onboardingItems[pageNumber + 1]) setPageNumber(pageNumber + 1);
                else setPageNumber(onboardingItems.length);
              }}
            >
              Next
            </span>
          
        </div>
      </div>
      </div>
    </div>
  );
};
