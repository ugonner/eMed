import { useEffect, useRef, useState } from "react";
import { ICluster } from "../../interfaces/cluster";
import { useAuthGuardContextStore } from "../../../auth/contexts/AuthGuardContext";
import {
  IonContent,
  IonIcon,
  IonItem,
  IonList,
  IonModal,
  IonPopover,
} from "@ionic/react";
import { ellipsisVertical } from "ionicons/icons";
import { CreateOrUpdateCluster } from "./CreateOrUpdateCluster";

export enum ClusterMenuActions {
  EDIT = "Edit",
}

export interface IClusterMenuProps {
  cluster: ICluster;
}

export const ClusterMenu = ({ cluster }: IClusterMenuProps) => {
  const { isAdmin } = useAuthGuardContextStore();

  const [openMenuOverlay, setOpenMenuOverlay] = useState(false);
  const [openActionOverlay, setOpenActionOverlay] = useState(false);
  const currentActionRef = useRef<ClusterMenuActions>();
  const actionsRef = useRef<ClusterMenuActions[]>([]);

  const closeAllOverlays = () => {
    setOpenActionOverlay(false);
    setOpenMenuOverlay(false);
  };
  useEffect(() => {
    if (isAdmin) actionsRef.current = [ClusterMenuActions.EDIT];
  }, []);

  return (
    <>
      <div
        role="button"
        aria-label="cluster menu"
        onClick={() => {
          setOpenMenuOverlay(!openMenuOverlay);
        }}
      >
        <IonIcon
          icon={ellipsisVertical}
          id={`cluster-menu-trigger-${cluster.id}`}
        ></IonIcon>
      </div>
      <IonPopover
        isOpen={openMenuOverlay}
        onDidDismiss={() => setOpenMenuOverlay(false)}
        trigger={`cluster-menu-trigger-${cluster.id}`}
      >
        <IonList>
          {actionsRef.current.map((item) => (
            <IonItem
              role="button"
              aria-label="menu action view button"
              onClick={() => {
                currentActionRef.current = item;
                setOpenActionOverlay(true);
              }}
            >
              <span>{item}</span>
            </IonItem>
          ))}
        </IonList>
      </IonPopover>

      <IonModal
        isOpen={openActionOverlay}
        onDidDismiss={() => setOpenActionOverlay(false)}
      >
        <IonContent>
          <h4>{currentActionRef.current}</h4>
          {currentActionRef.current === ClusterMenuActions.EDIT && (
            <CreateOrUpdateCluster
              cluster={cluster}
              onCompletion={() => closeAllOverlays()}
            />
          )}
        </IonContent>
      </IonModal>
    </>
  );
};
