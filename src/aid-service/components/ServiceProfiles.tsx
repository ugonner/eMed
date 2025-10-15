import { useEffect, useRef, useState } from "react";
import { APIBaseURL, getData } from "../../shared/api/base";
import { IQueryResult } from "../../shared/interfaces/api-response";
import { useAsyncHelpersContext } from "../../shared/contexts/async-helpers";
import { getLocalUser } from "../../utils";
import { IonIcon, IonItem, IonLabel, IonList } from "@ionic/react";
import { Pagination } from "../../shared/components/general/Pagination";
import { AidServiceProfileCard } from "./AidServiceProfileCard";
import { IAidServiceProfile } from "../interfaces/aid-service-profile";
import { folderOpenOutline } from "ionicons/icons";
import { ProfileActionsMenu } from "./ProfileActionMenu";

export interface IAidServiceProfilesProps {
  queryPayload: { [key: string]: unknown };
}

export const ServiceProfiles = ({ queryPayload }: IAidServiceProfilesProps) => {
  const { setLoading, handleAsyncError } = useAsyncHelpersContext();

  const queryPayloadRef = useRef<{ [key: string]: unknown }>(queryPayload);
  const queryBaseUrl = `${APIBaseURL}/aid-service/profile`;
  const reportComments = useRef<IQueryResult<IAidServiceProfile>>(
    {} as IQueryResult<IAidServiceProfile>
  );

  const [profilesResult, setAidServiceProfilesResult] = useState<
    IQueryResult<IAidServiceProfile>
  >({} as IQueryResult<IAidServiceProfile>);
  const getItems = async () => {
    try {
      setLoading({ isLoading: true, loadingMessage: "getting items" });
      const res = await getData<IQueryResult<IAidServiceProfile>>(
        queryBaseUrl,
        queryPayloadRef.current
      );
      setAidServiceProfilesResult(res);
      setLoading({ isLoading: false, loadingMessage: "" });
    } catch (error) {
      handleAsyncError(error, "Error getting items");
    }
  };
  useEffect(() => {
    getItems();
  }, []);

  return (
    <div>
      <IonList>
        {profilesResult.data?.map((aidServiceProfile) => (
           <AidServiceProfileCard
           key={aidServiceProfile.id} 
           aidServiceProfile={aidServiceProfile}
           showMenu={true}
          />
         
        ))}

        {!profilesResult.data?.length && (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "3em" }}>
              <IonIcon icon={folderOpenOutline}></IonIcon>
            </div>
            <div>No items.</div>
          </div>
        )}
      </IonList>

      <Pagination
        queryBaseUrl={queryBaseUrl}
        queryPayloadRef={queryPayloadRef}
        setQueryResult={setAidServiceProfilesResult}
        limit={10}
        totalItems={profilesResult.total}
      />
    </div>
  );
};
