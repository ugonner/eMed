import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import {
  ILocationAddress,
} from "../../aid-service/dtos/aid-service-profile.dto";
import {
  addCircleSharp,
  closeCircle,
  cloudSharp,
  compassSharp,
  reloadSharp,
} from "ionicons/icons";
import {
  IonAvatar,
  IonButton,
  IonCol,
  IonContent,
  IonGrid,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonModal,
  IonRow,
} from "@ionic/react";
import { useAsyncHelpersContext } from "../../shared/contexts/async-helpers";
import { IOpenStreetReverseGeoCode } from "../../aid-service/interfaces/location-geocode";
import { useGeoLocationStore } from "../hooks/location";
import { ILocationCord } from "./LocationVisualizer";

export interface ILocationAddressProps {
  locationAddress: ILocationAddress;
  setLocationAddress: Dispatch<SetStateAction<ILocationAddress>>;
  onCompletion?: () => void;
}
export interface ILinkInput {
  inputName: "street" | "city" | "locality" | "state" | "country" | "landmark";
  label: string;
  icon?: string;
}

export const LocationAddressManager = ({
  locationAddress,
  setLocationAddress,
  onCompletion,
}: ILocationAddressProps) => {
 const {getGeoCodeReverse, getLocationCords} = useGeoLocationStore();
  
  const [openLocationAddressOverlay, setOpenLocationAddressOverlay] =
    useState(false);
  const [addressData, setAddressData] =
    useState<ILocationAddress>(locationAddress);
  const [reloadLocation, setReloadLocation] = useState(false);
  const locationCordsRef = useRef<ILocationCord & {accuracy: number}>();
  

  const locationInputs: ILinkInput[] = [
    {
      inputName: "street",
      label: "enter street address",
      icon: cloudSharp,
    },
    {
      inputName: "city",
      label: "Enter city name",
    },
    {
      label: "locality",
      inputName: "locality",
      icon: compassSharp
    },
    {
      inputName: "state",
      label: "Enter state",
    },
    {
      inputName: "country",
      label: "Enter country",
    },
    {
      inputName: "landmark",
      label: "Enter nearest landmark",
    },
  ];

  useEffect(() => {
    getLocationCords()
    .then((coords) => {
      getGeoCodeReverse(coords as ILocationCord)
      .then((locationResult) => {
        if(locationResult) {
          setLocationAddress(locationResult);
          setAddressData(locationResult);
        }
      })
    })
  }, [reloadLocation])

  return (
    <div>
      <IonGrid>
        <IonRow>
          <IonCol 
          size="12"
           role="button"
           aria-label="oen location inputs"
                onClick={() =>
                  setOpenLocationAddressOverlay(!openLocationAddressOverlay)
                }
          >
            <LocationAddressCard
              locationAddress={addressData || ({} as ILocationAddress)}
            />
          </IonCol>
         
        </IonRow>
      </IonGrid>
      <IonModal
        isOpen={openLocationAddressOverlay}
        onDidDismiss={() => setOpenLocationAddressOverlay(false)}
      >
        <IonContent>
          <IonItem>
           <span
           role="button"
           aria-label="reload location"
           onClick={() => setReloadLocation(!reloadLocation)}
           >
            <IonIcon icon={reloadSharp}></IonIcon>
            <span className="ion-margin-horizontal">Accuracy: {locationCordsRef.current?.accuracy}</span>
           </span>
            <IonButton
              fill="clear"
              slot="end"
              onClick={() => setOpenLocationAddressOverlay(false)}
            >
              <IonIcon icon={closeCircle}></IonIcon>
            </IonButton>
          </IonItem>
          <div style={{ overflow: "auto" }}>
            {locationInputs.map((locationInput, index) => (
              <IonItem key={index} detailIcon={locationInput.icon}>
                <IonInput
                  name={locationInput.inputName}
                  label={locationInput.label}
                  labelPlacement="floating"
                  value={(addressData as any)[locationInput.inputName]}
                  onInput={(evt) => {
                    const { value, name } = evt.currentTarget;
                    setAddressData({
                      ...addressData,
                      [name]: value,
                    } as unknown as ILocationAddress);
                  }}
                />
              </IonItem>
            ))}
            <div className="ion-text-center">
              <IonButton
                color={"primary"}
                expand="full"
                onClick={() => {
                  setLocationAddress({ ...addressData });
                  setOpenLocationAddressOverlay(false);
                  if (onCompletion) onCompletion();
                }}
              >
                Save
              </IonButton>
            </div>
          </div>
        </IonContent>
      </IonModal>
    </div>
  );
};

export const LocationAddressCard = ({
  locationAddress,
}: {
  locationAddress: ILocationAddress;
}) => {
  return (
    <IonItem>
      <IonAvatar>
        <IonIcon icon={compassSharp} size="large"></IonIcon>
      </IonAvatar>
      <IonLabel>
        <h2>Location Address</h2>
        {Object.keys(locationAddress || {}).map((item, index) => (
          <p key={index}>
            <span>{item}</span>:{" "}
            <span>{((locationAddress || {}) as any)[item]} </span>
          </p>
        ))}
      </IonLabel>
    </IonItem>
  );
};
