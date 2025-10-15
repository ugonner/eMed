import { useEffect, useState } from "react";
import { useIInitContextStore } from "../../../shared/contexts/InitContextProvider";
import { IProfile } from "../../interfaces/user";
import { useAsyncHelpersContext } from "../../../shared/contexts/async-helpers";
import { APIBaseURL, getData, postData } from "../../../shared/api/base";
import {
  ISelectOption,
  MultiSelector,
} from "../../../shared/components/form/MultiSelector";
import { IonButton, IonItem } from "@ionic/react";
import { ICluster } from "../../interfaces/cluster";
import { AddOrRemoveAction } from "../../enums/cluster.enum";
import { ManageClustersDTO } from "../../dtos/cluster.dto";

export interface IManageUserClustersProps {
  user: IProfile;
  userClusters?: ICluster[];
  onCompletion?: () => void;
}

export const ManageUserClusters = ({
  user,
  userClusters,
  onCompletion,
}: IManageUserClustersProps) => {
  const { clustersRef } = useIInitContextStore();
  const { setLoading, handleAsyncError } = useAsyncHelpersContext();

  
  const [selectedClusterIds, setSelectedClusterIds] = useState<number[]>([]);

  const updateUserClusters = async (action: "add" | "remove" = "add") => {
    try {
      setLoading({ isLoading: true, loadingMessage: "" });

      const dto: ManageClustersDTO = {
           clusterIds: selectedClusterIds,
            options: {
                action: action === "add" ? AddOrRemoveAction.ADD : AddOrRemoveAction.REMOVE,
                override: true
            }
     }
      await postData(`${APIBaseURL}/user/${user.userId}/cluster/manage`, {
        method: "post",
        ...dto
    });
      setLoading({ isLoading: false, loadingMessage: "" });
    if(onCompletion) onCompletion();
    } catch (error) {
      handleAsyncError(error, "Error updating user clusters");
    }
  };

  return (
    <div>
      <MultiSelector
        label="Manage clusters to be associated with"
        initValues={(userClusters || []).map(
          (cluster) =>
            ({
              name: cluster?.name,
              value: cluster?.id,
            } as ISelectOption)
        )}
        options={clustersRef.current.map((cluster) => ({
          name: cluster?.name,
          value: cluster?.id,
        }))}
        onSelection={(selectedValues: ISelectOption[]) => {
            setSelectedClusterIds(selectedValues.map((sVal) => sVal.value as number))
        }}
      />

      <IonButton expand="full" fill="clear" onClick={() => updateUserClusters()}>
        <span style={{ color: "white" }}>Update Clusters</span>
      </IonButton>
      
      <IonButton expand="full" fill="clear" onClick={() => {
        if(onCompletion) onCompletion();
      } }>
        <span style={{ color: "white" }}>Cancel</span>
      </IonButton>
      
    </div>
  );
};
