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
import { RoleCard } from "./RoleCard";
import { CreateRole } from "./CreateRole";

export interface IServiceRolesProps {
  onCompletion?: () => void;
}

export const ServiceRoles = ({onCompletion}: IServiceRolesProps) => {
  const { rolesRef } = useIInitContextStore();

  const [openCreateRoleOverlay, setOpenCreateRoleOverlay] =
    useState(false);

  const closeAllOverlays = () => {
    setOpenCreateRoleOverlay(false);
    if(onCompletion) onCompletion();
  }
  return (
    <div>
      <IonButton
        expand="full"
        onClick={() => setOpenCreateRoleOverlay(!openCreateRoleOverlay)}
        aria-haspopup={true}
        aria-expanded={openCreateRoleOverlay}
      >
        <IonIcon icon={addCircleSharp}></IonIcon>
        <span className="ion-margin-horizontal">Create Role</span>
      </IonButton>
      <IonList>
        {rolesRef.current.map((role) => (
          <RoleCard key={role.id} role={role} />
        ))}
      </IonList>
      <IonModal
        isOpen={openCreateRoleOverlay}
        onDidDismiss={() => setOpenCreateRoleOverlay(false)}
      >
        <IonContent>
          <CreateRole onCompletion={() => {
            closeAllOverlays();
          }} />
        </IonContent>
      </IonModal>
    </div>
  );
};
