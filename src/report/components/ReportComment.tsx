import { IonAvatar, IonImg, IonItem, IonLabel } from "@ionic/react";
import { IReportComment } from "../interfaces/report-comment";

export interface IReportCommentProps {
    reportComment: IReportComment;
}

export const ReportCommentCard = ({reportComment}: IReportCommentProps) => {
    return (
        <IonItem>
            <IonAvatar>
                <IonImg src={reportComment.profile?.avatar} alt={reportComment?.profile?.firstName} />
            </IonAvatar>
            <IonLabel>
                <h6>{reportComment?.profile?.firstName} {reportComment?.profile?.lastName}</h6>
                <p>{reportComment?.comment}</p>
                <small>{reportComment?.createdAt?.split("T")[0]}</small>
            </IonLabel>
        </IonItem>
    )
}