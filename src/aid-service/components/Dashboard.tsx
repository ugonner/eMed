import { useRef, useState } from "react";
import { APIBaseURL, getData } from "../../shared/api/base";
import {
  IonCol,
  IonGrid,
  IonIcon,
  IonItem,
  IonRow,
  IonSearchbar,
} from "@ionic/react";
import { IQueryResult } from "../../shared/interfaces/api-response";
import { IAidServiceProfile } from "../interfaces/aid-service-profile";
import { useAsyncHelpersContext } from "../../shared/contexts/async-helpers";
import { QueryFilter } from "../../shared/components/general/QueryFilter";
import { useIInitContextStore } from "../../shared/contexts/InitContextProvider";
import { ISelectOption } from "../../shared/components/form/MultiSelector";
import { AidServiceProfileCard } from "./AidServiceProfileCard";
import { AidServiceActionMenu } from "./AidServiceActionMenu";
import { ProfileActionsMenu } from "./ProfileActionMenu";
import { Pagination } from "../../shared/components/general/Pagination";
import { AidServiceProfileVerificationStatus } from "../../shared/enums/aid-service";
import { folderOpenOutline } from "ionicons/icons";

export const AidServiceProfileDashboard = () => {
  const { aidServicesRef, clustersRef } = useIInitContextStore();
  const { setLoading, handleAsyncError } = useAsyncHelpersContext();

  const queryPayloadRef = useRef<{ [key: string]: unknown }>({});
  const [queryPayload, setQueryPayload] = useState<{ [key: string]: unknown }>(
    {}
  );
  const queryBaseUrl = `${APIBaseURL}/aid-service/profile`;
  const [queryResult, setQueryResult] = useState<
    IQueryResult<IAidServiceProfile>
  >({} as IQueryResult<IAidServiceProfile>);

  const getResults = async () => {
    try {
      setLoading({ isLoading: true, loadingMessage: "getting results" });
      const res = await getData<IQueryResult<IAidServiceProfile>>(
        queryBaseUrl,
        { ...queryPayloadRef.current }
      );
      setQueryResult(res);
      setLoading({ isLoading: false, loadingMessage: "" });
    } catch (error) {
      handleAsyncError(error, "Error getting results");
    }
  };

  return (
    <IonGrid>
      <IonRow>
        <IonCol size="12">
          <h2>Service Profiles</h2>
        </IonCol>
      </IonRow>
      <IonRow>
        <IonCol size="4">
          <div className="ion-text-center">
            {queryResult.total}
            <br /> <small>Total</small>
          </div>
        </IonCol>
        <IonCol size="4">
          <IonItem>
            <IonSearchbar
              aria-label="search service profiles"
              onIonInput={(evt) => {
                if (evt.detail?.value && evt.detail?.value.length < 4) return;
                queryPayloadRef.current = {
                  ...queryPayloadRef.current,
                  searchTerm: evt.detail?.value,
                };
                getResults();
              }}
            />
          </IonItem>
        </IonCol>
        <IonCol size="4">
          <QueryFilter
            queryPayloadRef={queryPayloadRef}
            queryUrl={queryBaseUrl}
            setResult={setQueryResult}
            queryInputs={[
              {
                name: "verificationStatus",
                type: "select",
                value: Object.values(AidServiceProfileVerificationStatus).map(
                  (vStatus) => ({
                    name: vStatus,
                    value: vStatus,
                  })
                ),
              },
              {
                name: "dDay",
                type: "dateRange",
                value: [],
              },
              {
                name: "aidServiceId",
                type: "select",
                value: aidServicesRef.current.map((aidService) => ({
                  name: aidService.name,
                  value: aidService.id,
                })) as ISelectOption[],
              },
              {
                name: "clusterIds",
                type: "select",
                value: clustersRef.current.map((cluster) => ({
                  name: cluster.name,
                  value: cluster.id,
                })),
              },
            ]}
          />
        </IonCol>
      </IonRow>
      {queryResult.data?.map((aidProfile) => (
        <IonRow key={aidProfile.id}>
          <IonCol size="11">
            <AidServiceProfileCard showMenu={true} aidServiceProfile={aidProfile} />
          </IonCol>
          <IonCol size="1">
            <ProfileActionsMenu aidServiceProfile={aidProfile} />
          </IonCol>
        </IonRow>
      ))}

      {!queryResult.data?.length && (
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "2em" }}>
            <IonIcon icon={folderOpenOutline}></IonIcon>
          </div>
          <div>No Items</div>
        </div>
      )}
      <IonRow>
        <IonCol size="12">
          <Pagination
            queryBaseUrl={queryBaseUrl}
            queryPayloadRef={queryPayloadRef}
            setQueryResult={setQueryResult}
            limit={10}
            totalItems={queryResult.total}
          />
        </IonCol>
      </IonRow>
    </IonGrid>
  );
};
