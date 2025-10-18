import { IonAvatar, IonButton, IonCol, IonContent, IonFab, IonFabButton, IonGrid, IonIcon, IonItem, IonLabel, IonPopover, IonRow, IonText } from "@ionic/react"
import { UserBannerCard } from "../components/UserBannerCard"
import { ServiceBookings } from "../../Booking/components/ServiceBookings"
import { getLocalUser } from "../../utils"
import { useRef, useState } from "react"
import { IAidService } from "../../aid-service/interfaces/aid-service.interface"
import { useIInitContextStore } from "../../shared/contexts/InitContextProvider"
import { useAsyncHelpersContext } from "../../shared/contexts/async-helpers"
import { IProfile } from "../../user/interfaces/user"
import { chatboxSharp, logoWhatsapp } from "ionicons/icons"
import { QuickActions } from "../components/QuickActions"

export const callCenterPhoneNumber = "2347034667861";
export const HomePage = () => {
  const {aidServicesRef} = useIInitContextStore(); 
  const {setLoading, handleAsyncError} = useAsyncHelpersContext();
   
   const [openMessageOverlay, setOpenMessageOverlay] = useState(false);
   const messageRef = useRef<string>("");
   const selectedAidServiceRef = useRef<IAidService>();

   const user = getLocalUser();

  const sendWhatsappMessage = (phoneNumber: string, message: string) => {
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.location.href = url;
  }

  return (
        <IonContent>
            <IonGrid>
                <UserBannerCard user={user as IProfile} />
                <QuickActions />
                <IonRow>
                    <IonCol size="12">
                        <h2>My Bookings</h2>
                        <ServiceBookings queryPayload={{userId: user?.userId}} />
                    </IonCol>
                </IonRow>
            </IonGrid>

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