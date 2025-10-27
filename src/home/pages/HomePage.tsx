import {
  IonAvatar,
  IonButton,
  IonCheckbox,
  IonCol,
  IonContent,
  IonFab,
  IonFabButton,
  IonGrid,
  IonIcon,
  IonItem,
  IonLabel,
  IonPopover,
  IonRow,
  IonText,
} from "@ionic/react";
import { UserBannerCard } from "../components/UserBannerCard";
import { ServiceBookings } from "../../Booking/components/ServiceBookings";
import {
  formatCurrency,
  formatObjectToReadableText,
  getLocalUser,
  sendWhatsappMessage,
  useLocalStorage,
} from "../../utils";
import { useEffect, useRef, useState } from "react";
import { IAidService } from "../../aid-service/interfaces/aid-service.interface";
import { useIInitContextStore } from "../../shared/contexts/InitContextProvider";
import { useAsyncHelpersContext } from "../../shared/contexts/async-helpers";
import { IAuthUserProfile, IProfile } from "../../user/interfaces/user";
import {
  arrowForward,
  chatboxSharp,
  checkboxOutline,
  checkboxSharp,
  colorFill,
  logoWhatsapp,
  medicalSharp,
} from "ionicons/icons";
import { QuickActions } from "../components/QuickActions";
import { useGeoLocationStore } from "../../Booking/hooks/location";
import { LocalStorageEnum } from "../../shared/enums";
import { APIBaseURL, AppBaseUrl, getData } from "../../shared/api/base";
import { BookingRoutes } from "../../Booking/enums/routes";
import { IBooking, PaymentStatus } from "../../Booking/interfaces/booking";
import { IQueryResult } from "../../shared/interfaces/api-response";
import { BookingStatus } from "../../Booking/enums/booking";
import { HealthPosts } from "../components/HealthPosts";
import { Posts } from "../../post/datasets/posts";
import { IAppSettings } from "../../shared/interfaces/app-settings";
import { I } from "vitest/dist/reporters-5f784f42";
import { PostCard } from "../../post/components/PostCard";
import { IPost } from "../../post/interfaces/post";
import { PostRoutes } from "../../post/enums/route";
import { ShortCutButtons } from "../components/ShortCutButtons";

export const callCenterPhoneNumber = "2347034667861";
export const HomePage = () => {
  const { getLocationCords } = useGeoLocationStore();
  const { updateAppSettings, appSettings, aidServicesRef } = useIInitContextStore();
  const { getItem, setItem } = useLocalStorage();
  const { setLoading, handleAsyncError } = useAsyncHelpersContext();

  const [openMessageOverlay, setOpenMessageOverlay] = useState(false);
  const [lastRunningBooking, setLastRunningBooking] = useState<IBooking>();
  const [openHealthTipOverlay, setOpenHealthTipOverlay] = useState(false);

  const messageRef = useRef<string>("");
  const latestPostRef = useRef<IPost>();
  const authUser = getItem<IAuthUserProfile>(LocalStorageEnum.USER);
  const user = authUser?.profile;
 
  const lastHealthTip = getItem<string>(
    LocalStorageEnum.LAST_VIEWED_HEALTH_TIP
  );

  useEffect(() => {
    const getLastBooking = async () => {
      try {
        setLoading({ isLoading: true, loadingMessage: "" });
        const res = await getData<IQueryResult<IBooking>>(
          `${APIBaseURL}/booking`,
          {
            paymentStatus: PaymentStatus.PAID,
            bookingStatus: BookingStatus.IN_PROGRESS,
            userId: user?.userId,
          }
        );
        if (res.data && res.data.length > 0) setLastRunningBooking(res.data[0]);
        setLoading({ isLoading: false, loadingMessage: "" });
      } catch (error) {
        handleAsyncError(error, "Error getting last running booking");
      }
    };
    getLastBooking();
  }, []);

  useEffect(() => {
    latestPostRef.current = Posts[0];
    if (
      latestPostRef.current?.id != Number(lastHealthTip) &&
      !appSettings?.hideHealthTip
    )
      setOpenHealthTipOverlay(true);
  }, []);

  return (
    <IonContent>
      <IonGrid>
        <UserBannerCard
          user={user as IProfile}
          lastRunningBooking={lastRunningBooking}
        />
        <ShortCutButtons user={user} />
        <QuickActions />
        <HealthPosts posts={Posts} />
      </IonGrid>

      <IonFab vertical="center" horizontal="end" slot="fixed">
        <IonFabButton
          color="danger"
          onClick={async () => {
            try {
              setLoading({
                isLoading: true,
                loadingMessage: "getting location info",
              });
              const geoCoords = await getLocationCords();
              setLoading({ isLoading: false, loadingMessage: "" });

              const emergencyService = aidServicesRef.current.find((aService) =>
                /emergency/i.test(aService.name)
              );

              const emergencyMsgBody = {
                Message: `${user?.firstName} ${user?.lastName} is in need of ${emergencyService?.name} ${user?.phoneNumber}`,
                cost: formatCurrency(emergencyService?.serviceRate || 0),
                follow: `${AppBaseUrl}${BookingRoutes.TRACK_LOCATION}?lat=${geoCoords?.latitude}&lon=${geoCoords?.longitude}`,
                GeoAccuracy: geoCoords?.accuracy,
              };
              const msgString = formatObjectToReadableText(emergencyMsgBody);
              sendWhatsappMessage(callCenterPhoneNumber, msgString);
            } catch (error) {
              handleAsyncError(error, "Error sending SOS");
            }
          }}
        >
          <span style={{ fontWeight: "bold", fontSize: "2em" }}>
            <IonIcon icon={medicalSharp}></IonIcon>
          </span>
        </IonFabButton>
        <div className="ion-text-center">SOS</div>
      </IonFab>

     
      <IonPopover
        isOpen={!appSettings?.hideHealthTip}
        onDidDismiss={() => updateAppSettings({hideHealthTip: true}, {persist: false, setState: true})}
      >
        <div>
          <div className="ion-margin">
          
          <h3 className="ion-text-center">Tip!</h3>
          <p>Did You Know About This:</p>
          <p style={{fontWeight: "bold"}}> {latestPostRef.current?.title}</p>
          <IonItem
            role="buton"
            aria-label={appSettings?.hideHealthTip ? "show health tip": "hide health tip"}
            onClick={() => {
                const setting: IAppSettings = {
                  hideHealthTip: appSettings?.hideHealthTip ? false : true,
                } as IAppSettings;
                updateAppSettings(setting, {persist: true, setState: false});
              }}  
          
          >
            <IonIcon 
            icon={appSettings?.hideHealthTip ? checkboxSharp : checkboxOutline} 
            />
            <IonLabel
            className="ion-margin-horizontal"
            >
              <p>{appSettings?.hideHealthTip ? "shw health tip": "hide health tip"} </p>
          </IonLabel>
          </IonItem>
          
        </div>
        <IonButton
            expand="full"
            fill="clear"
            routerLink={`${PostRoutes.VIEW_POST}?pi=${latestPostRef.current?.id}`}
          >
            Know Detail{" "}
            <IonIcon
              className="ion-margin-horizonal"
              icon={arrowForward}
            ></IonIcon>{" "}
          </IonButton>
          <IonButton
            expand="full"
            onClick={() => {
              updateAppSettings({hideHealthTip: true}, {persist: false, setState: true})
            }}
          >
            Ok
          </IonButton>
        </div>
      </IonPopover>
    </IonContent>
  );
};
