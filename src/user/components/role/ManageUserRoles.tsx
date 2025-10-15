import { useEffect, useState } from "react";
import { useIInitContextStore } from "../../../shared/contexts/InitContextProvider";
import { IAuthUserProfile, IProfile } from "../../interfaces/user";
import { RoleDTO } from "../../../auth/dtos/role.dto";
import { useAsyncHelpersContext } from "../../../shared/contexts/async-helpers";
import { APIBaseURL, getData, postData } from "../../../shared/api/base";
import {
  ISelectOption,
  MultiSelector,
} from "../../../shared/components/form/MultiSelector";
import { IonButton, IonItem, IonSelect, IonSelectOption } from "@ionic/react";

export interface IManageUserRolesProps {
  user: IProfile;
  onCompletion?: () => void;
}

export const ManageUserRoles = ({
  user,
  onCompletion,
}: IManageUserRolesProps) => {
  const { rolesRef } = useIInitContextStore();
  const { setLoading, handleAsyncError } = useAsyncHelpersContext();

  
  const [selectedRoleId, setSelectedRoleId] = useState<number>();
    const [userRole, setUserRole] = useState<RoleDTO>();

    const updateUserRole = async () => {
        const res = await getData<IAuthUserProfile>(`${APIBaseURL}/auth/${user.userId}`);
        setUserRole(res.role);
    }
  
  
  const updateUserRoles = async (action: "add" | "remove" = "add") => {
    try {
      setLoading({ isLoading: true, loadingMessage: "" });

      await postData(`${APIBaseURL}/auth/${user.userId}/role/${selectedRoleId}/assign`, {
        method: "post",
      });
      setLoading({ isLoading: false, loadingMessage: "" });
      if(onCompletion) onCompletion();
    } catch (error) {
      handleAsyncError(error, "Error updating user roles");
    }
  };

  useEffect(() => {
    updateUserRole().catch((err) => console.log("Error updating user role", err.message))
  }, []);
   

  return (
    <div>
        <IonItem>
            <IonSelect
            label="Choose Users Role"
            labelPlacement="floating"
            value={userRole?.id}
            onIonChange={(evt) => {
                setSelectedRoleId(Number(evt.detail.value))
            }}
            >
                {
                    rolesRef.current.map((role) => (
                        <IonSelectOption key={role.name} value={role.id}>{role.name}</IonSelectOption>
                    ))
                }
            </IonSelect>
        </IonItem>

      <IonButton expand="full" fill="clear" onClick={() => updateUserRoles()}>
        <span style={{ color: "white" }}>Update Roles</span>
      </IonButton>
    </div>
  );
};
