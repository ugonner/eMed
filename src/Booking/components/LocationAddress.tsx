import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { ILocationAddress } from "../../aid-service/dtos/aid-service-profile.dto";
import {
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
  IonPopover,
  IonRow,
  IonSpinner,
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
  const { setLoading, handleAsyncError } = useAsyncHelpersContext();
  const { getGeoCodeReverse, getLocationCords } = useGeoLocationStore();

  const [openLocationAddressOverlay, setOpenLocationAddressOverlay] =
    useState(false);
  const [addressData, setAddressData] =
    useState<ILocationAddress>(locationAddress);
  const [reloadLocation, setReloadLocation] = useState(false);
  const [openLocationAccuracyOverlay, setOpenLocationAccuracyOverlay] =
    useState(false);

  const [locationCordData, setLoctionCordsData] = useState<
    ILocationCord & { accuracy: number }
  >();
  const locationStartTimeRef = useRef<number>(0);
  const stopAutoLocationRef = useRef<boolean>(false);

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
      icon: compassSharp,
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

  const resetLocationStartData = () => {
    stopAutoLocationRef.current = true;
    locationStartTimeRef.current = 0;
    setOpenLocationAccuracyOverlay(false);
  };

  const retrieveLocationAddress = async (dto: ILocationCord) => {
    resetLocationStartData();
    try {
      const locationRes = await getGeoCodeReverse(dto);
      if (!locationRes) throw new Error("Address info not retrieved");
      setLocationAddress(locationRes);
      setAddressData(locationRes);
    } catch (error) {
      console.log(
        (error as Error).message,
        "Error retriving address from coords"
      );
    }
  };

  useEffect(() => {
    const autoGetLocationCords = async () => {
      try {
        if (!openLocationAddressOverlay) setOpenLocationAccuracyOverlay(true);
        const cordsRes = await getLocationCords();
        if (!cordsRes) throw new Error("Error getting geo position coords");
        setLoctionCordsData(cordsRes);
        if (locationStartTimeRef.current === 0)
          locationStartTimeRef.current = Date.now();
        if (
          cordsRes.accuracy > 10 &&
          !stopAutoLocationRef.current &&
          Date.now() - locationStartTimeRef.current < 2 * 60 * 1000
        ) {
          return await autoGetLocationCords();
        }
        if (cordsRes.accuracy <= 10) await retrieveLocationAddress(cordsRes);
      } catch (error) {
        resetLocationStartData();
      }
    };
    autoGetLocationCords();
  }, [reloadLocation]);

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
              editable={true}
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
              className="ion-padding"
              role="button"
              aria-label="reload location"
              onClick={() => {
                stopAutoLocationRef.current = false;
                setReloadLocation(!reloadLocation);
              }}
            >
              <IonIcon icon={reloadSharp}></IonIcon>
              <span className="ion-margin-horizontal">
                Accuracy: {locationCordData?.accuracy}
              </span>
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

      <IonPopover
        isOpen={openLocationAccuracyOverlay}
        onDidDismiss={() => setOpenLocationAccuracyOverlay(false)}
      >
        <div className="ion-text-center">
          <h3>
            {
              stopAutoLocationRef.current && (
                <IonSpinner className="ion-margin-horizontal"/>
              )
            }
            Automatic Location Accuracy
          </h3>

          <p>
            <span style={{ fontSize: "2em" }}>
              {!locationCordData?.accuracy && (
                <IonSpinner className="ion-margin-horizontal" />
              )}
              {locationCordData?.accuracy}m
            </span>
          </p>
          <p>
            For better results your location accuracy should be less than 50
            meters.
            <br /> You can move around or outdoors for better reception.
          </p>
          <IonButton
            onClick={() => {
              if (locationCordData) retrieveLocationAddress(locationCordData);
            }}
          >
            Don't Wait, Continue with this accuracy
          </IonButton>
        </div>
      </IonPopover>
    </div>
  );
};

export const LocationAddressCard = ({
  locationAddress,
  editable,
}: {
  locationAddress: ILocationAddress;
  editable?: boolean;
}) => {
  return (
    <IonItem>
      <IonAvatar>
        <IonIcon icon={compassSharp} size="large"></IonIcon>
      </IonAvatar>
      <IonLabel>
        <h2>
          Location Address
          {editable && <small className="ion-margin-horizontal">Tap To Edit</small>}
        </h2>
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
