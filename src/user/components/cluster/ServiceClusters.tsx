import { useEffect, useState } from "react";
import { useIInitContextStore } from "../../../shared/contexts/InitContextProvider";
import {
  IonButton,
  IonContent,
  IonIcon,
  IonList,
  IonModal,
} from "@ionic/react";
import { addCircleSharp } from "ionicons/icons";
import { ClusterCard } from "./ClusterCard";
import { CreateOrUpdateCluster } from "./CreateOrUpdateCluster";

export interface IServiceClustersProps {
  onCompletion?: () => void;
}

export const ServiceClusters = ({onCompletion}: IServiceClustersProps) => {
  const { clustersRef } = useIInitContextStore();

  const [openCreateClusterOverlay, setOpenCreateClusterOverlay] =
    useState(false);

  const closeAllOverlays = () => {
    setOpenCreateClusterOverlay(false);
    if(onCompletion) onCompletion();
  }
  return (
    <div>
      <IonButton
        expand="full"
        onClick={() => setOpenCreateClusterOverlay(!openCreateClusterOverlay)}
        aria-haspopup={true}
        aria-expanded={openCreateClusterOverlay}
      >
        <IonIcon icon={addCircleSharp}></IonIcon>
        <span className="ion-margin-horizontal">Create Cluster</span>
      </IonButton>
      <IonList>
        {clustersRef.current.map((cluster) => (
          <ClusterCard key={cluster.id} cluster={cluster} />
        ))}
      </IonList>
      <IonModal
        isOpen={openCreateClusterOverlay}
        onDidDismiss={() => setOpenCreateClusterOverlay(false)}
      >
        <IonContent>
          <CreateOrUpdateCluster onCompletion={() => {
            closeAllOverlays();
          }} />
        </IonContent>
      </IonModal>
    </div>
  );
};
