import { useEffect, useRef, useState } from "react";
import { APIBaseURL, getData } from "../../shared/api/base";
import { IQueryResult } from "../../shared/interfaces/api-response";
import { useAsyncHelpersContext } from "../../shared/contexts/async-helpers";
import { getLocalUser } from "../../utils";
import { IonIcon, IonItem, IonLabel, IonList } from "@ionic/react";
import { Pagination } from "../../shared/components/general/Pagination";
import { ICallRoom } from "../interfaces/call";
import { CallRoomCard } from "./CallRoomCard";
import { IProfile } from "../../user/interfaces/user";
import { folderOpenOutline } from "ionicons/icons";

export interface ICallRoomsProps {
  queryPayload: { [key: string]: unknown };
}

export const ServiceCallRooms = ({ queryPayload }: ICallRoomsProps) => {
  const { setLoading, handleAsyncError } = useAsyncHelpersContext();

  const queryPayloadRef = useRef<{ [key: string]: unknown }>(queryPayload);
  const queryBaseUrl = `${APIBaseURL}/call-room`;
  const reportComments = useRef<IQueryResult<ICallRoom>>(
    {} as IQueryResult<ICallRoom>
  );

  const user = getLocalUser();

  const [callsResult, setCallRoomsResult] = useState<IQueryResult<ICallRoom>>(
    {} as IQueryResult<ICallRoom>
  );
  const getItems = async () => {
    try {
      setLoading({ isLoading: true, loadingMessage: "getting items" });
      const res = await getData<IQueryResult<ICallRoom>>(
        queryBaseUrl,
        queryPayloadRef.current
      );
      setCallRoomsResult(res);
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
        {callsResult.data?.map((callRoom, index) => (
          <CallRoomCard
            key={index}
            callRoom={callRoom}
            localUser={user || ({} as IProfile)}
          />
        ))}
        {!callsResult.data?.length && (
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
        setQueryResult={setCallRoomsResult}
        limit={10}
        totalItems={callsResult.total}
      />
    </div>
  );
};
