import { useEffect, useRef, useState } from "react";
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
import { RoleDTO } from "../../../auth/dtos/role.dto";
import { CreateRole } from "./CreateRole";

export enum RoleMenuActions {
  EDIT = "Edit",
}

export interface RoleDTOMenuProps {
  role: RoleDTO;
}

export const RoleMenu = ({ role }: RoleDTOMenuProps) => {
  const { isAdmin } = useAuthGuardContextStore();

  const [openMenuOverlay, setOpenMenuOverlay] = useState(false);
  const [openActionOverlay, setOpenActionOverlay] = useState(false);
  const currentActionRef = useRef<RoleMenuActions>();
  const actionsRef = useRef<RoleMenuActions[]>([]);

  const closeAllOverlays = () => {
    setOpenActionOverlay(false);
    setOpenMenuOverlay(false);
  };
  useEffect(() => {
    if (isAdmin) actionsRef.current = [RoleMenuActions.EDIT];
  }, []);

  return (
    <>
      <div
        role="button"
        aria-label="role menu"
        onClick={() => {
          setOpenMenuOverlay(!openMenuOverlay);
        }}
      >
        <IonIcon
          icon={ellipsisVertical}
          id={`role-menu-trigger-${role.id}`}
        ></IonIcon>
      </div>
      <IonPopover
        isOpen={openMenuOverlay}
        onDidDismiss={() => setOpenMenuOverlay(false)}
        trigger={`role-menu-trigger-${role.id}`}
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
          {currentActionRef.current === RoleMenuActions.EDIT && (
            <CreateRole
              roleData={role}
              onCompletion={() => closeAllOverlays()}
            />
          )}
        </IonContent>
      </IonModal>
    </>
  );
};
