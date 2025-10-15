import { IonAvatar, IonImg, IonItem, IonLabel } from "@ionic/react";
import { IReport } from "../interfaces/report";
import { useEffect, useRef } from "react";

export interface IReportCardProps {
    report: IReport;
}

export const ReportCard = ({report}: IReportCardProps) => {
    const reportRef = useRef<IReport>(report);
    useEffect(() => {
        reportRef.current = report
    }, [report])
    return (
        <IonItem>
            <IonAvatar>
                <IonImg src={reportRef.current?.profile?.avatar} alt={reportRef.current?.profile?.firstName} />           
             </IonAvatar>
             <IonLabel>
                <p>{report.review}</p>
                <h6>
                    Reported against {reportRef.current?.entityOwner?.firstName}
                </h6>
                <h6>
                    Reported On: {reportRef.current?.createdAt?.split("T")[0]}
                </h6>
             </IonLabel>
        </IonItem>

    )
}