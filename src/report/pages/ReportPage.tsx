import { useLocation } from "react-router";
import { useAsyncHelpersContext } from "../../shared/contexts/async-helpers"
import { useEffect, useState } from "react";
import { APIBaseURL, getData } from "../../shared/api/base";
import { IReport } from "../interfaces/report";
import { IonCol, IonContent, IonGrid, IonHeader, IonRow, IonTitle } from "@ionic/react";
import { ReportCard } from "../components/ReportCard";
import { ReportMenu } from "../components/ReportMenu";
import { ReportComments } from "../components/ReportComments";

export const ReportPage = () => {
    const {setLoading, handleAsyncError} = useAsyncHelpersContext();

    const queryParams = new URLSearchParams(useLocation().search);
    const reportId = queryParams.get("ri");

    const [report, setReport] = useState<IReport>()
    const getReport = async () => {
        try{
            setLoading({isLoading: true, loadingMessage: "getting report"});

            const res = await getData<IReport>(`${APIBaseURL}/report/${reportId}`);
            setReport(res);
            setLoading({isLoading: false, loadingMessage: ""})
        }catch(error){
            handleAsyncError(error, "Error getting report")
        }
    }
    useEffect(() => {
        
    }, [])

    return (
        <>
        
        <IonHeader>
            <IonTitle>Report</IonTitle>
        </IonHeader>
        <IonContent>
            <IonGrid>
                <IonRow>
                    <IonCol size="11">
                        <ReportCard report={report as IReport} />
                    </IonCol>
                    <IonCol size="1">
                        <ReportMenu report={report as IReport} />
                    </IonCol>
                </IonRow>
                <IonRow>
                    <IonCol size="12">
                        <ReportComments reportId={Number(reportId)} />
                    </IonCol>
                </IonRow>
            </IonGrid>
        </IonContent>
        
        </>
    )
}