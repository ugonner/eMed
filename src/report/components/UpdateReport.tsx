import { useState } from "react";
import { useAsyncHelpersContext } from "../../shared/contexts/async-helpers";
import { UpdateReportDTO } from "../dtos/report";
import { APIBaseURL, postData } from "../../shared/api/base";
import { IonCol, IonGrid, IonItem, IonRow, IonSelect, IonSelectOption, IonTextarea } from "@ionic/react";

export interface IUpdateReportProps {
    reportId: number;
    onCompletion?: () => void;
}

export const UpdateReport = ({reportId, onCompletion}: IUpdateReportProps) => {
    const {setLoading, handleAsyncError} = useAsyncHelpersContext();

    const [reportDto, setReportDto] = useState<UpdateReportDTO>({reportId});

    const updateReport = async () => {
        try{
            setLoading({isLoading: true, loadingMessage: "updating report"});
            await postData(`${APIBaseURL}/report`, {
                method: "put",
                ...reportDto,
                reportId
            });
            setLoading({isLoading: false, loadingMessage: ""})
        }catch(error){
            handleAsyncError(error, "Error updating report")
        }
    }
    return (
        <IonGrid>
            <IonRow>
                <IonCol size="12">
                    <h3>Update Report</h3>
                </IonCol>
            </IonRow>
            <IonRow>
                <IonCol size="12">
                    <IonItem>
                        <IonTextarea
                        label="comment"
                        labelPlacement="floating"
                        onIonInput={(evt) => {
                            setReportDto({...reportDto, comment: evt.detail.value as string})
                        }}
                        />
                    </IonItem>
                    <IonItem>
                        <IonSelect
                        label="Required, select report status"
                        value={reportDto.resolved}
                        onIonChange={(evt) => {
                            setReportDto({...reportDto, resolved: Boolean(evt.detail.value)})
                        }}
                        >
                            <IonSelectOption value={false}>Not Resolved</IonSelectOption>
                            <IonSelectOption value={true}>Resolved</IonSelectOption>
                        </IonSelect>
                    </IonItem>

                    <IonItem>
                        {
                            ["save", "cancel"].map((item) => (
                                <span
                                key={item}
                                role="button"
                                className="ion-margin"
                                onClick={() => {
                                    if(item === "save")  updateReport();
                                    else if(onCompletion) onCompletion();
                                }}>
                                    {item}
                                </span>
                            ))
                        }
                    </IonItem>
                </IonCol>
            </IonRow>
        </IonGrid>
    )
}