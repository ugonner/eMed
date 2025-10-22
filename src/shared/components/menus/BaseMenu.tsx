import {
  briefcase,
  callSharp,
  cart,
  chatbox,
  home,
  logOutSharp,
  person,
  shapes,
} from "ionicons/icons";

import {
  IonAvatar,
  IonButton,
  IonContent,
  IonHeader,
  IonIcon,
  IonImg,
  IonItem,
  IonLabel,
  IonList,
  IonMenu,
  IonModal,
  IonText,
  IonToolbar,
} from "@ionic/react";
import { UserRoutes } from "../../../user/enums/routes.enum";
import { HomeRoutes } from "../../../home/enums/routes";
import { getLocalUser } from "../../../utils";
import { defaultUserImageUrl } from "../../DATASETS/defaults";
import { useAuthGuardContextStore } from "../../../auth/contexts/AuthGuardContext";
import { AuthRoutes } from "../../../auth/enums/routes";
import { PaymetRoutes } from "../../../payment/enums/routes";
import { useState } from "react";
import { ReviewAndRate } from "../../../review/components/ReviewndRating";
import { ServiceType } from "../../../review/enums/service";
import { BookingRoutes } from "../../../Booking/enums/routes";
import { icon } from "leaflet";

export interface INavigationButton {
  id: number;
  label: string;
  routeLink: string;
  icon: string;
}

export const BaseMenu = () => {
  const { logOutUser } = useAuthGuardContextStore();
  const [openReviewwOverlay, setOpenReviewOverlay] = useState(false);
  
  const user = getLocalUser();

  const navigationButtonss: INavigationButton[] = [
    { id: 1, label: "home", routeLink: HomeRoutes.HOME, icon: home },
    {
      id: 2,
      label: "My Profile",
      routeLink: `${UserRoutes.PROFILE}?ui=${user?.userId}`,
      icon: person,
    },
    {
      id: 3,
      label: "My Appointments",
      routeLink: `${BookingRoutes.USER_BOOKINGS}`,
      icon: briefcase,
    },
    {
      id: 4,
      label: "Subscription",
      routeLink:"",
      icon: briefcase
    }
  ];
  

  return (
    <IonMenu menuId="base-menu" contentId="base-menu-content">
      <IonHeader>
        <IonToolbar>
          <IonItem>
            <IonLabel className="ion-margin">
              <p>{user?.firstName}</p>
            </IonLabel>
          </IonItem>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          {navigationButtonss.map((navButton) => (
            <IonItem key={navButton.id} routerLink={navButton.routeLink}>
                <IonIcon icon={navButton.icon}></IonIcon>
                <IonLabel className="ion-margin"> {navButton.label} </IonLabel>
              
            </IonItem>
          ))}
          <IonItem
          role="button"
          aria-haspopup={true}
          aria-expanded={openReviewwOverlay}
          onClick={() => setOpenReviewOverlay(!openReviewwOverlay)}
          >
             <IonIcon icon={chatbox}></IonIcon>
             <samp className="ion-margin-horizontal">Review Feedback</samp>
            
          </IonItem>
          <IonItem
            role="button"
            aria-label="logout"
            onClick={() => logOutUser()}
          >
              <IonButton fill="clear" onClick={() => logOutUser()} routerLink={AuthRoutes.LOGIN}>
                <IonIcon icon={logOutSharp}></IonIcon>
                <IonLabel className="ion-margin"> Log Out </IonLabel>
              </IonButton>
           
          </IonItem>
        </IonList>
      </IonContent>
      <IonModal
      isOpen={openReviewwOverlay}
      onDidDismiss={() => setOpenReviewOverlay(false)}
      >
        <IonContent>
          
        <IonButton expand="full" fill="clear" onClick={() => setOpenReviewOverlay(false)}>close</IonButton>
        <div>
          <ReviewAndRate
          serviceTypeEntityId={1}
          serviceType={ServiceType.APP_PROFILE}
          onCompletion={() => setOpenReviewOverlay(false)}
          />
        </div>
        </IonContent>
      </IonModal>
    </IonMenu>
  );
};
