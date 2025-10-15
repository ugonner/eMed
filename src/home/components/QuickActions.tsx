import React, { useEffect, useRef, useState } from "react";
import {
  IonContent,
  IonPage,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonFab,
  IonFabButton,
  IonIcon,
  IonText,
  useIonRouter,
  IonModal,
  IonList,
  IonItem,
  IonLabel,
  IonAvatar,
  IonSearchbar,
  IonButton,
} from "@ionic/react";
import {
  call,
  walk,
  heart,
  calendarSharp,
  walkSharp,
  briefcaseSharp,
  text,
  callSharp,
  listSharp,
  arrowForward,
  closeSharp,
} from "ionicons/icons";
import { usePlainRTCContextStore } from "../../call/contexts/plainwebrtc";
import { IApiResponse } from "../../shared/interfaces/api-response";
import { IPlainRTCConnectedUser, IProfile } from "../../user/interfaces/user";
import { BroadcastEvents } from "../../call/enums/events.enum";
import { callPurpose, CallType, RoomType } from "../../call/enums/call.enum";

import "./QuickActions.css";
import { IAidService } from "../../aid-service/interfaces/aid-service.interface";
import { useIInitContextStore } from "../../shared/contexts/InitContextProvider";
import { useAsyncHelpersContext } from "../../shared/contexts/async-helpers";
import { UserBannerCard } from "./UserBannerCard";
import { getLocalUser } from "../../utils";
import { AidServiceRoutes } from "../../aid-service/enums/routes";
import { BookingRoutes } from "../../Booking/enums/routes";
import { UserRoutes } from "../../user/enums/routes.enum";
import { IQuickLinkItem } from "../interfaces/hone";

const serviceHomeItems: IQuickLinkItem[] = [
  {
    id: 1,
    icon: calendarSharp,
    text: "Book A Service",
    ariaLabel: "Book a service",
  },
  {
    id: 2,
    icon: walkSharp,
    text: "Call Live Providers",
    ariaLabel: "Connect aid service providers who are currently online",
  },
  {
    id: 3,
    icon: callSharp,
    text: "Call A Service",
    ariaLabel: "View all available services",
  },
  {
    id: 4,
    icon: briefcaseSharp,
    text: "Provide Service",
    ariaLabel: "Apply to be a service provider",
  },
];

const ServiceQuickActions: React.FC = () => {
  const { socketRef, callReceiver } = usePlainRTCContextStore();
  const { setLoading, handleAsyncError } = useAsyncHelpersContext();
  const { aidServicesRef } = useIInitContextStore();
  const router = useIonRouter();
  const selectedAidServiceRef = useRef<IAidService>();

  const [selectedAction, setSelectedAction] = useState<IQuickLinkItem>();
  const [openAidServicesOverlay, setOpenAidServicesOverlay] = useState(false);
  const [openAidProfilesOverlay, setOpenAidProfilesOverlay] = useState(false);
  const [aidServiceOptions, setAidServiceOptions] = useState<IAidService[]>(
    aidServicesRef.current
  );

  const [connectedUsers, setConnectedUsers] = useState<
    IPlainRTCConnectedUser[]
  >([]);
  const [connectedUsersOptions, setConnectedUsersOptions] = useState<
    IPlainRTCConnectedUser[]
  >([]);

  const closeAllOverlays = () => {
    setOpenAidProfilesOverlay(false);
    setOpenAidServicesOverlay(false);
  };

  const getLiveAidServiceProviders = async (
    aidServiceId?: number
  ): Promise<IApiResponse<IPlainRTCConnectedUser[]>> => {
    return await new Promise((resolve) => {
      socketRef.current?.emit(
        BroadcastEvents.GET_AVALABLE_AID_SERVICE_PROVIDERS,
        { aidServiceId },
        resolve
      );
    });
  };

  const callAidServiceProvider = async (
    aidProfile: IPlainRTCConnectedUser,
    aidServiceId: number
  ) => {
    callReceiver({
      peerSocketId: aidProfile.socketId as string,
      roomId: `${socketRef.current?.id}${Date.name}`,
      roomType: RoomType.PEER_TO_PEER,
      callType: CallType.VIDEO,
      callPurpose: callPurpose.AID_SERVICE,
      aidServiceProfileId: aidProfile.aidServiceProfiles?.find(
        (aidProfile) => aidProfile.aidService?.id == aidServiceId
      )?.id,
    });
  };
  const autoCallServiceProvider = async (aidServiceId: number) => {
    try {
      const usersRes = await getLiveAidServiceProviders(aidServiceId);
      if (usersRes.error) throw new Error(usersRes.error as string);
      if (usersRes.data && usersRes.data.length > 0) {
        callAidServiceProvider(usersRes.data[1], aidServiceId);
      }
    } catch (error) {
      console.log(
        "Error calling aid service provider",
        (error as Error).message
      );
    }
  };

 
  useEffect(() => {
    setAidServiceOptions(aidServicesRef.current)
  }, [aidServicesRef.current])
  return (
    <>
        <IonRow>
          {serviceHomeItems.map((item) => (
            <IonCol size="6" key={item.id}>
              <IonCard
                button
                onClick={() => {
                  setSelectedAction(item);
                  setOpenAidServicesOverlay(!openAidServicesOverlay);
                }}
                className="service-card ion-text-center"
              >
                <IonCardHeader className="ion-text-center">
                  
                  <IonCardTitle>
                    <IonIcon icon={item.icon} size="large"></IonIcon>
                    <br/>
                    {item.text}
                    </IonCardTitle>
                </IonCardHeader>
              </IonCard>
            </IonCol>
          ))}
        </IonRow>
      

     
      <IonModal
        isOpen={openAidServicesOverlay}
        onDidDismiss={() => setOpenAidServicesOverlay(false)}
      >
        <IonContent>
          <IonItem>
            <IonButton
            aria-label="close"
            slot="end"
            fill="clear"
            onClick={() => closeAllOverlays()}
            >
              <IonIcon icon={closeSharp}></IonIcon>
            </IonButton>
          </IonItem>
          <h2>{selectedAction?.text}</h2>
          <IonItem>
            <IonSearchbar
            placeholder="search for a service"
            onIonInput={(evt) => {
              setAidServiceOptions(aidServicesRef.current.filter((aService) => aService.name === evt.detail.value));
            }}
            />
          </IonItem>
          <IonList>
            {aidServiceOptions.map((aidService) => (
              <IonItem key={aidService.id}>
                <IonLabel
                  role={"button"}
                  aria-label={`view ${aidService.name}`}
                  onClick={() => {
                    closeAllOverlays();
                    return router.push(
                      `${AidServiceRoutes.AID_SERVICE_SINGLE}?asi=${aidService.id}`
                    );
                  }}
                >
                  <p>{aidService.name}</p>
                  <small>
                    click the icon to {selectedAction?.text} or click the
                    service name to view more detail of the service.
                  </small>
                </IonLabel>
                <IonAvatar
                  className="ion-margin"
                  role="button"
                  aria-label={`${selectedAction?.text} on ${aidService.name}`}
                  onClick={async () => {
                    try {
                      selectedAidServiceRef.current = aidService;
                      closeAllOverlays();
                      if (selectedAction?.text === "Book A Service")
                        return router.push(
                          `${BookingRoutes.BOOK_SERVICE}?asi=${aidService.id}`
                        );
                      if (selectedAction?.text === "Call Live Providers") {
                        setLoading({
                          isLoading: true,
                          loadingMessage: "fetching live providers",
                        });
                        const liveProviders = await getLiveAidServiceProviders(
                          aidService.id
                        );
                        setLoading({ isLoading: false, loadingMessage: "" });
                        setConnectedUsers(
                          liveProviders.data as IPlainRTCConnectedUser[]
                        );
                        setConnectedUsersOptions(
                          liveProviders.data as IPlainRTCConnectedUser[]
                        );
                        return setOpenAidProfilesOverlay(true);
                      }
                      if (selectedAction?.text === "Call A Service")
                        return autoCallServiceProvider(aidService.id);
                      if (selectedAction?.text === "Provide Service")
                        return router.push(
                          `${AidServiceRoutes.APPLY}?asi=${aidService.id}`
                        );
                    } catch (error) {
                      handleAsyncError(
                        error,
                        `Error taking quick action ${selectedAction?.text}`
                      );
                    }
                  }}
                >
                  <IonIcon icon={selectedAction?.icon}></IonIcon>
                </IonAvatar>
              </IonItem>
            ))}
          </IonList>
        </IonContent>
      </IonModal>

      <IonModal
        isOpen={openAidProfilesOverlay}
        onDidDismiss={() => setOpenAidProfilesOverlay(false)}
      >
        <IonContent>
          <IonItem>
            <IonButton
            slot="end"
            fill="clear"
            aria-label="close"
            onClick={() => closeAllOverlays()}
            >
              <IonIcon icon={closeSharp}></IonIcon>
            </IonButton>
          </IonItem>
          <h2>{selectedAction?.text} on {selectedAidServiceRef.current?.name}</h2>
          <IonItem>
            <IonSearchbar
            aria-label="search a provider"
            placeholder="Search a provider"
            onIonInput={(evt) => {
              return setConnectedUsersOptions(connectedUsers.filter((usr) => Boolean(usr.aidServiceProfiles?.find((aProfile) => aProfile.name === evt.detail.value?.toLowerCase()))));
            }}
            />
          </IonItem>
          <IonList>
            {
              connectedUsersOptions?.map((usr, index) => (
                <IonItem key={index}>
                  <IonLabel>
                    <p
                    role={"button"}
                    aria-label="view detail"
                    onClick={() => {
                      closeAllOverlays();
                      const serviceProfile = usr.aidServiceProfiles?.find((aProfile) => aProfile.aidService.id == selectedAidServiceRef.current?.id);
                      return router.push(`${AidServiceRoutes.AID_SERVICE_PROFILE}?aspi=${serviceProfile?.id}`)
                    }}
                    >
                      {usr.aidServiceProfiles?.find((aProfile) => aProfile.aidService.id == selectedAidServiceRef.current?.id)?.name}
                    </p>
                    <small>{usr.userName}</small>
                  </IonLabel>
                  <IonAvatar 
                  className="ion-margin"
                  role={"button"}
                  aria-label="call"
                  onClick={() => {
                    callAidServiceProvider(usr, selectedAidServiceRef.current?.id as number)
                  }}
                  >
                    <IonIcon icon={callSharp}></IonIcon>
                  </IonAvatar>
                </IonItem>
              ) )
            }
          </IonList>
        </IonContent>
      </IonModal>
    </>
  );
};

export default ServiceQuickActions;
