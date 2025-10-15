import {
  IonAvatar,
  IonButton,
  IonIcon,
  IonImg,
  IonInput,
  IonItem,
  IonLabel,
  IonText,
} from "@ionic/react";
import { useRef, useState } from "react";

import { APIBaseURL, postData } from "../../../shared/api/base";
import { RoleDTO } from "../../../auth/dtos/role.dto";
import { useAsyncHelpersContext } from "../../../shared/contexts/async-helpers";
import { useIInitContextStore } from "../../../shared/contexts/InitContextProvider";

export interface ICreateRoleProps {
  roleData?: RoleDTO;
  onCompletion?: () => void
}
export const CreateRole = ({roleData, onCompletion}: ICreateRoleProps) => {
  const {setLoading, handleAsyncError} = useAsyncHelpersContext();
const {setReLoadEntities} = useIInitContextStore();


  const [role, setRole] = useState<RoleDTO | undefined>(roleData);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const createRole = async () => {
    try{
      setLoading({isLoading: true, loadingMessage: "Saving role"});
      
    if(!role) throw new Error("No data filled for the role");

     roleData?.id ?  await postData(`${APIBaseURL}/auth/role/${roleData.id}`, {
      method: "put",
      ...role,
    }) :  await postData(`${APIBaseURL}/auth/role`, {
      method: "post",
      ...role,
    });
    setLoading({isLoading: false, loadingMessage: ""});
    setReLoadEntities((prev) => (!prev));
    if(onCompletion) onCompletion();

    }catch(error){
      handleAsyncError(error, "Error saving role");
    }
  };

  return (
    <div>
      <IonItem>
        <IonInput
          className="ion-margin"
          type="text"
          name="name"
          label="Role Name"
          labelPlacement="stacked"
          fill="outline"
          onIonChange={(evt) => {
            const { name, value } = evt.target;
            setRole({ ...role, [name]: value } as RoleDTO);
          }}
        ></IonInput>
      </IonItem>
      <IonItem>
        <IonInput
          className="ion-margin"
          type="text"
          name="description"
          label="Description"
          labelPlacement="stacked"
          fill="outline"
          onIonChange={(evt) => {
            const { name, value } = evt.target;
            setRole({ ...role, [name]: value } as RoleDTO);
          }}
        ></IonInput>
      </IonItem>
      

        <IonButton
          color={"dark"}
          expand="full"
          onClick={() => {
            createRole();
          }}
        >
          Save
        </IonButton>
    </div>
  );
};
