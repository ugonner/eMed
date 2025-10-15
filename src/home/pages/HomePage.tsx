import { IonAvatar, IonButton, IonCol, IonContent, IonFab, IonFabButton, IonGrid, IonIcon, IonItem, IonLabel, IonPopover, IonRow, IonText } from "@ionic/react"
import { UserBannerCard } from "../components/UserBannerCard"
import ServiceQuickActions from "../components/QuickActions"
import { ServiceBookings } from "../../Booking/components/ServiceBookings"
import { getLocalUser } from "../../utils"
import { IPlainRTCConnectedUser, IProfile } from "../../user/interfaces/user"
import { callSharp, chatboxSharp, logoWhatsapp, refreshCircleOutline } from "ionicons/icons"
import { IApiResponse } from "../../shared/interfaces/api-response"
import { usePlainRTCContextStore } from "../../call/contexts/plainwebrtc"
import { BroadcastEvents } from "../../call/enums/events.enum"
import { callPurpose, CallType, RoomType } from "../../call/enums/call.enum"
import { useRef, useState } from "react"
import { Browser } from "@capacitor/browser"
import { IAidService } from "../../aid-service/interfaces/aid-service.interface"
import { useIInitContextStore } from "../../shared/contexts/InitContextProvider"
import { useAsyncHelpersContext } from "../../shared/contexts/async-helpers"

export const callCenterPhoneNumber = "2347034667861";
export const HomePage = () => {
  const {aidServicesRef} = useIInitContextStore(); 
  const {setLoading, handleAsyncError} = useAsyncHelpersContext();
  const {socketRef, callReceiver} = usePlainRTCContextStore();
   
   const [openMessageOverlay, setOpenMessageOverlay] = useState(false);
   const messageRef = useRef<string>("");
   const selectedAidServiceRef = useRef<IAidService>();


    const user = getLocalUser();
 const getLiveAidServiceProviders = async (
    aidServiceId?: number
  ): Promise<IApiResponse<IPlainRTCConnectedUser[]>> => {
    return await new Promise((resolve) => {
      setLoading({isLoading: true, loadingMessage: "finding user"})
      socketRef.current?.emit(
        BroadcastEvents.GET_AVALABLE_AID_SERVICE_PROVIDERS,
        { aidServiceId },
        (res: IApiResponse<IPlainRTCConnectedUser[]>) => {
          setLoading({isLoading: false, loadingMessage: ""});
          resolve(res);
        }
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
        callAidServiceProvider(usersRes.data[0], aidServiceId);
      }
      else {
        messageRef.current = `No Provider is currently available at this moment, for a live call on ${selectedAidServiceRef.current?.name}`;
        setOpenMessageOverlay(true);
      }
    } catch (error) {
      console.log(
        "Error calling aid service provider",
        (error as Error).message
      );
    }
  };

  const sendWhatsappMessage = (phoneNumber: string, message: string) => {
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.location.href = url;
  }

  return (
        <IonContent>
            <IonGrid>
                <UserBannerCard user={user as IProfile} />
                <ServiceQuickActions />
                <IonRow>
                    <IonCol size="12">
                        <h2>My Bookings</h2>
                        <ServiceBookings queryPayload={{userId: user?.userId}} />
                    </IonCol>
                </IonRow>
            </IonGrid>
             {/* FAB for Live Call interpreter */}
                  <IonFab vertical="bottom" horizontal="start" slot="fixed">
                    <IonButton
                      className="ion-padding"
                      shape="round"
                      color="success"
                      onClick={() => {
                        selectedAidServiceRef.current = aidServicesRef.current.find((aService) => /sign/i.test(aService.name) );
                        autoCallServiceProvider(selectedAidServiceRef.current?.id as number)
                      }}
                    >
                      <span>
                        <IonIcon className="ion-margin-horizontal" icon={ socketRef.current?.connected ? callSharp: refreshCircleOutline}></IonIcon>
                          Call Interpreter
                      </span>
                    </IonButton>
                  </IonFab>

                  {/* FAB for Live Call interpreter */}
                  <IonFab vertical="bottom" horizontal="end" slot="fixed">
                    <IonFabButton
                      size="small"
                      color="success"
                      onClick={() => {
                        sendWhatsappMessage(callCenterPhoneNumber, `Hi team, I'm ${user?.firstName}`)
                      }}
                    >
                    
                      <span>
                        <IonIcon className="ion-margin-horizontal" icon={chatboxSharp}></IonIcon>
                      </span>
                    </IonFabButton>
                  </IonFab>
            
                  <IonPopover
                  isOpen={openMessageOverlay}
                  onDidDismiss={() => setOpenMessageOverlay(false)}
                  >
                    <IonContent>
                      <p>{messageRef.current}</p>
                      <p>Quickly Notify Our Customer Center</p>
                      <IonButton expand="full" color={"primary"} onClick={() => {
                        sendWhatsappMessage(callCenterPhoneNumber, messageRef.current)
                      }}
                      >
                        <span style={{color: "white"}}>
                          <IonIcon className="ion-margin-horizontal" icon={logoWhatsapp}></IonIcon>
                          Notify Us
                        </span>
                      </IonButton>
                      <IonButton color={"primary"} expand="full" onClick={() => setOpenMessageOverlay(false)}>
                        <span style={{color: "white"}}>No problem, I will try later</span>
                      </IonButton>
                    </IonContent>
                  </IonPopover>
        </IonContent>
    )
}