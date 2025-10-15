import {
  IonAvatar,
  IonCol,
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonModal,
  IonRow,
  useIonRouter,
} from "@ionic/react";
import { useIInitContextStore } from "../../shared/contexts/InitContextProvider";
import { AidServiceRoutes } from "../enums/routes";
import { addCircleSharp } from "ionicons/icons";
import { AidServiceCard } from "./AidServiceCard";
import { AidServiceActionMenu } from "./AidServiceActionMenu";
import { useState } from "react";
import { AidServiceManager } from "./AidServiceManager";

export interface IServiceListProps {
  onCompletion?: () => void;
}
export const ServiceList = ({onCompletion}: IServiceListProps) => {
  const { aidServicesRef } = useIInitContextStore();
  

  const [openCreateAidServiceOverlay, setOpenCreateAidServiceOverlay] = useState(false);

  return (
    <>
      <IonRow>
        <IonCol size="12">
          <IonItem>
            <IonLabel>
              <h3> {aidServicesRef.current.length} Services</h3>
            </IonLabel>
            <IonAvatar
              role="button"
              aria-label="create aid service"
              onClick={() => setOpenCreateAidServiceOverlay(!openCreateAidServiceOverlay)}
            >
              <IonIcon
                icon={addCircleSharp}
                className="ion-margin-horizontal"
              ></IonIcon>
            </IonAvatar>
          </IonItem>
        </IonCol>
      </IonRow>
      {aidServicesRef.current.map((aidService) => (
        <AidServiceCard aidService={aidService} showMenu={true} />
      ))}

      <IonModal
      isOpen={openCreateAidServiceOverlay}
      onDidDismiss={() => setOpenCreateAidServiceOverlay(false)}
      >
        <IonContent>
          <AidServiceManager onCompletion={() => {
            setOpenCreateAidServiceOverlay(false);
            if(onCompletion) onCompletion();
          }} />
        </IonContent>
      </IonModal>
    </>
  );
};
