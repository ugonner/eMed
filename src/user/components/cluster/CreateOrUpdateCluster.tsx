import { useState } from "react";
import { ICluster } from "../../interfaces/cluster";
import { useAsyncHelpersContext } from "../../../shared/contexts/async-helpers";
import { APIBaseURL, postData } from "../../../shared/api/base";
import { IonButton, IonCard, IonCardContent, IonCardHeader, IonInput, IonItem, IonList, IonTextarea, IonTitle } from "@ionic/react";
import { useIInitContextStore } from "../../../shared/contexts/InitContextProvider";

export interface ICreateOrUpdateClusterProps {
    cluster?: ICluster;
    onCompletion?: () => void;
}

export const CreateOrUpdateCluster = ({cluster, onCompletion}: ICreateOrUpdateClusterProps) => {
    const {setLoading, handleAsyncError} = useAsyncHelpersContext();
const {setReLoadEntities} = useIInitContextStore();

    const [clusterDto, setClusterDto] = useState<ICluster>(cluster || {} as ICluster);

    const saveCluster = async () => {
        try{
            setLoading({isLoading: true, loadingMessage: "saving cluster"})
            if(cluster?.id) {
                await postData(`${APIBaseURL}/user/cluster/${cluster.id}`, {
                method:"put",
                ...clusterDto
            })
            }else {
                await postData(`${APIBaseURL}/user/cluster`, {
                method: "post",
                ...clusterDto
            })
            }
            setLoading({isLoading: false, loadingMessage: ""})
            setReLoadEntities((prev) => (!prev))
            if(onCompletion) onCompletion();
        }catch(error){
            handleAsyncError(error, "Error saving cluster")
        }
    }

    return (
        <div>
            <IonCard>
                <IonCardHeader>
                    <IonTitle>Manage Cluster {cluster?.name}</IonTitle>
                </IonCardHeader>
                <IonCardContent>
                    <IonList>
                        <IonItem>
                            <IonInput
                            label="Cluster Name"
                            labelPlacement="floating"
                            value={clusterDto.name}
                            onIonInput={(evt) => {
                                setClusterDto({...clusterDto, name: evt.detail.value as string})
                            }}
                            />
                        </IonItem>
                        <IonItem>
                            <IonTextarea
                            label="Cluster Description"
                            labelPlacement="floating"
                            onIonInput={(evt) => {
                                setClusterDto({...clusterDto, description: evt.detail.value as string})
                            }}
                            />
                        </IonItem>
                        <IonButton
                        expand="full"
                        onClick={() => saveCluster()}
                        >
                            <span style={{color: "white"}}>Save</span>
                        </IonButton>
                        <IonButton
                        expand="full"
                        onClick={() => {
                            if(onCompletion) onCompletion();
                        }}
                        >
                            <span style={{color: "white"}}>Cancel</span>
                        </IonButton>
                    </IonList>
                </IonCardContent>
            </IonCard>
        </div>
    )
}