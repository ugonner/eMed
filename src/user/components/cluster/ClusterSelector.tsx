import { useState } from "react";
import { useIInitContextStore } from "../../../shared/contexts/InitContextProvider";
import { ICluster } from "../../interfaces/cluster";
import { IonAvatar, IonContent, IonIcon, IonItem, IonLabel, IonModal } from "@ionic/react";
import { addCircleSharp } from "ionicons/icons";
import { ISelectOption, MultiSelector } from "../../../shared/components/form/MultiSelector";

export interface IClusterSelectorProps {
    initClusters?: ICluster[];
    label?: string;
    onSelection: (clusters: ICluster[]) => void;
}

export const ClusterSelector = ({initClusters, label, onSelection}: IClusterSelectorProps) => {
    const {clustersRef} = useIInitContextStore();

    const [selectedClusters, setSelectedClusters] = useState<ICluster[]>(initClusters || []);
    const [openSelectorOverlay, setOpenSelectorOverlay] = useState(false)
    return (
        <div>
            <IonItem
            role="button"
            aria-label="select clusters"
            onClick={() => setOpenSelectorOverlay(!openSelectorOverlay)}
            >
                <IonAvatar>
                    <IonIcon icon={addCircleSharp}></IonIcon>
                </IonAvatar>
                <IonLabel>
                    <h3>
                        {label || "Select Clusters"}
                    </h3>
                    <p>
                        
                        {
                            selectedClusters.map((cluster) => (
                                <span key={cluster.id} className="ion-margin">{cluster.name}</span>
                            ))
                        }
                    </p>
                    <small>Clicking this will show a popover for you to select clusters</small>
                </IonLabel>
            </IonItem>
            <IonModal
            isOpen={openSelectorOverlay}
            onDidDismiss={() => setOpenSelectorOverlay(false)}
            >
                <IonContent>
                    <MultiSelector
                    label={label as string}
                    options={clustersRef.current.map((cluster) => ({
                        name: cluster.name, value: cluster.id
                    }))}
                    initValues={selectedClusters.map((cluster) => ({
                        name: cluster.name, value: cluster.id
                    }))}
                    onSelection={(selectedValus: ISelectOption[]) => {
                       const clusters: ICluster[] = selectedValus.map((cl) => ({
                            name: cl.name, id: cl.value
                       })) as ICluster[];
                       setSelectedClusters(clusters);
                       onSelection(clusters);
                       setOpenSelectorOverlay(false);
                    }}
                    />
                </IonContent>
            </IonModal>
        </div>
    )
}