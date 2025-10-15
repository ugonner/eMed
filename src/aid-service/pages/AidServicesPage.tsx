import { useEffect, useState } from "react";
import { IAidService } from "../interfaces/aid-service.interface";
import { APIBaseURL, getData } from "../../shared/api/base";
import { IonCol, IonContent, IonGrid, IonRow } from "@ionic/react";
import { IQueryResult } from "../../shared/interfaces/api-response";
import { AidServiceCard } from "../components/AidServiceCard";
import { useIInitContextStore } from "../../shared/contexts/InitContextProvider";
import { AidServiceActionMenu } from "../components/AidServiceActionMenu";

export const AidServicesPage = () => {
  const { aidServicesRef } = useIInitContextStore();

  return (
    <IonContent>
      <IonGrid>
        {aidServicesRef.current.map((aidService) => (
          <IonRow key={aidService.id}>
            <IonCol size="11">
              <AidServiceCard
                key={aidService.id}
                aidService={aidService as IAidService}
              />
            </IonCol>
            <IonCol size="1">
              <AidServiceActionMenu aidService={aidService} />
            </IonCol>
          </IonRow>
        ))}
      </IonGrid>
    </IonContent>
  );
};
