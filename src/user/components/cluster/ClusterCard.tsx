import { IonAvatar, IonCol, IonItem, IonLabel, IonRow } from "@ionic/react";
import { useAuthGuardContextStore } from "../../../auth/contexts/AuthGuardContext";
import { ICluster } from "../../interfaces/cluster";
import { ClusterMenu } from "./ClusterMenu";

export interface IClusterCardProps {
  cluster: ICluster;
}
export const ClusterCard = ({ cluster }: IClusterCardProps) => {
  const { isAdmin } = useAuthGuardContextStore();

  return (
    <>
      <IonRow>
        <IonCol size="11">
          <IonItem>
            {isAdmin && (
              <IonAvatar>
                <ClusterMenu cluster={cluster} />
              </IonAvatar>
            )}
            <IonLabel className="ion-margin-horizontal">
              <h3>{cluster.name}</h3>
              <p>
                <span>{cluster.description?.substring(0, 140)}</span>
              </p>
            </IonLabel>
          </IonItem>
        </IonCol>
      </IonRow>
    </>
  );
};
