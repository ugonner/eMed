import {
  briefcase,
  briefcaseSharp,
  callSharp,
  cart,
  chatbox,
  folderOpen,
  home,
  logOutSharp,
  people,
  person,
  shapes,
  walkSharp,
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
  IonText,
  IonToolbar,
} from "@ionic/react";
import { getLocalUser } from "../../../utils";
import { defaultUserImageUrl } from "../../DATASETS/defaults";
import { useAuthGuardContextStore } from "../../../auth/contexts/AuthGuardContext";
import { AuthRoutes } from "../../../auth/enums/routes";
import { PaymetRoutes } from "../../../payment/enums/routes";
import { AdminRoutes } from "../../../admin/enums/routes";

export interface INavigationButton {
  id: number;
  label: string;
  routeLink: string;
  icon: string;
}

export const AdminMenu = () => {
    const {logOutUser} = useAuthGuardContextStore();

    const user = getLocalUser();

  const navigationButtonss: INavigationButton[] = [
    { id: 1, label: "home", routeLink: AdminRoutes.HOME, icon: home },
    {
      id: 2,
      label: "Users",
      routeLink: `${AdminRoutes.USER}`,
      icon: people,
    },
    {
      id: 3,
      label: "Service Providers",
      routeLink: `${AdminRoutes.SERVICE_PROFILE}`,
      icon: walkSharp,
    },
    {
      id: 4,
      label: "Reviews / Feedbacks",
      routeLink: `${AdminRoutes.REVIEWS}`,
      icon: chatbox,
    },
    {
        id: 5,
        label: "Reports",
        routeLink: `${AdminRoutes.REPORT}`,
        icon: folderOpen
    },
    {
        id: 6,
        label: "Transactions",
        routeLink: `${AdminRoutes.TRANSACTION}`,
        icon: briefcaseSharp
    }
  ];
  

  return (
    <IonMenu menuId="admin-menu" contentId="admin-menu-content">
      <IonHeader>
        <IonToolbar>
          <IonItem>
            <IonAvatar>
              <IonImg
                src={user?.avatar || defaultUserImageUrl}
                alt={"Your display"}
              />
            </IonAvatar>
            <IonLabel className="ion-margin">
              <p>{user?.firstName}</p>
            </IonLabel>
          </IonItem>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          {navigationButtonss.map((navButton) => (
            <IonItem key={navButton.id}>
              <IonButton fill="clear" routerLink={navButton.routeLink}>
                <IonIcon icon={navButton.icon}></IonIcon>
                <IonLabel className="ion-margin"> {navButton.label} </IonLabel>
              </IonButton>
            </IonItem>
          ))}
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
    </IonMenu>
  );
};
