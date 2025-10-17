import {
  briefcase,
  callSharp,
  cart,
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

export interface INavigationButton {
  id: number;
  label: string;
  routeLink: string;
  icon: string;
}

export const BaseMenu = () => {
  const { isLoggedIn, logOutUser } = useAuthGuardContextStore();

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
      label: "My Transactions",
      routeLink: `${PaymetRoutes.TRANSACTIONS}`,
      icon: briefcase,
    }
  ];
  

  return (
    <IonMenu menuId="base-menu" contentId="base-menu-content">
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
