import { IonAvatar, IonCol, IonItem, IonLabel, IonRow } from "@ionic/react";
import { RoleDTO } from "../../../auth/dtos/role.dto";
import { useAuthGuardContextStore } from "../../../auth/contexts/AuthGuardContext";
import { RoleMenu } from "./RoleMenu";

export interface RoleDTOCardProps {
  role: RoleDTO;
}
export const RoleCard = ({ role }: RoleDTOCardProps) => {
  const { isAdmin } = useAuthGuardContextStore();

  return (
    <>
      <IonRow>
        <IonCol size="11">
          <IonItem>
            {isAdmin && (
              <IonAvatar>
                <RoleMenu role={role} />
              </IonAvatar>
            )}
            <IonLabel className="ion-margin-horizontal">
              <h3>{role.name}</h3>
              <p>
                <span>{role.description?.substring(0, 140)}</span>
              </p>
            </IonLabel>
          </IonItem>
        </IonCol>
      </IonRow>
    </>
  );
};
