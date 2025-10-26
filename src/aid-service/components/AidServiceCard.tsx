import { IonAvatar, IonCol, IonImg, IonItem, IonLabel, IonRow } from "@ionic/react";
import { AidServiceDTO } from "../dtos/aid-service.dto";
import { formatCamelCaseToSentence } from "../../shared/helpers";
import { formatCurrency } from "../../utils";
import { IAidService } from "../interfaces/aid-service.interface";
import { AidServiceActionMenu } from "./AidServiceActionMenu";

export const defaultAidServiceImageUrl = "/favicon.png";
export interface IAidServiceCardProps {
  aidService: IAidService;
  showMenu?: boolean;
}

export const AidServiceCard = ({ aidService, showMenu }: IAidServiceCardProps) => {
  return (
    <>
      <IonRow>
        <IonCol size={showMenu ? "11" : "12"}>
          
    <div>
      <IonItem>
        <IonAvatar className="ion-margin">
          <IonImg src={aidService.avatar || defaultAidServiceImageUrl} alt="aid service" />
        </IonAvatar>
        <IonLabel>
          <h1>{aidService.name}</h1>
          <p> {aidService?.description?.substring(0, 150)} </p>
         
          <p>
            {["serviceRate"].map((field) => (
              <span key={field}>
                {formatCamelCaseToSentence(field)}{" "}
                <span className="ion-margin" style={{ fontWeight: "bold" }}>
                  {formatCurrency((aidService as any)[field], "NGN")}
                </span>
              </span>
            ))}
          </p>
        </IonLabel>
      </IonItem>
    </div>
        </IonCol>
        {
           showMenu && (
            <IonCol size="1">
              <AidServiceActionMenu aidService={aidService} />
            </IonCol>
           )
        }
      </IonRow>
    </>
  );
};
