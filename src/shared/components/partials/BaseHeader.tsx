import {
  IonAvatar,
  IonButton,
  IonHeader,
  IonIcon,
  IonMenuButton,
  IonMenuToggle,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { menuSharp, notificationsSharp } from "ionicons/icons";

export interface IHeaderProps {
  title: string;
}

export const BaseHeader = ({ title }: IHeaderProps) => {
  return (
    <IonHeader>
      <IonToolbar>
        <IonMenuToggle menu="base-menu" slot="start">
          <IonButton fill="clear" className="icon-only">
            <IonIcon icon={menuSharp}></IonIcon>
          </IonButton>
        </IonMenuToggle>
        <IonTitle>{title}</IonTitle>
        <span slot="end" className="ion-margin-horizontal">
          <IonIcon icon={notificationsSharp}></IonIcon>
        </span>
      </IonToolbar>
    </IonHeader>
  );
};
