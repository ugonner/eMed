import {
  IonButton,
  IonHeader,
  IonIcon,
  IonMenuButton,
  IonMenuToggle,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { menuSharp } from "ionicons/icons";

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
      </IonToolbar>
    </IonHeader>
  );
};
