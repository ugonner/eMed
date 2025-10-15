import { useEffect, useRef, useState } from "react";
import { APIBaseURL, getData } from "../../shared/api/base";
import { IQueryResult } from "../../shared/interfaces/api-response";
import { useAsyncHelpersContext } from "../../shared/contexts/async-helpers";
import { getLocalUser } from "../../utils";
import {
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  useIonRouter,
} from "@ionic/react";
import { Pagination } from "../../shared/components/general/Pagination";
import { IBooking } from "../interfaces/booking";
import { BookingCard } from "./BookingCard";
import { BookingRoutes } from "../enums/routes";
import { folderOpenOutline } from "ionicons/icons";
import { BookingActionsMenu } from "./BookingActionsMenu";

export interface IBookingsProps {
  queryPayload: { [key: string]: unknown };
}

export const ServiceBookings = ({ queryPayload }: IBookingsProps) => {
  const { setLoading, handleAsyncError } = useAsyncHelpersContext();
  const router = useIonRouter();

  const queryPayloadRef = useRef<{ [key: string]: unknown }>(queryPayload);
  const queryBaseUrl = `${APIBaseURL}/booking`;
  const reportComments = useRef<IQueryResult<IBooking>>(
    {} as IQueryResult<IBooking>
  );

  const [bookingsResult, setBookingsResult] = useState<IQueryResult<IBooking>>(
    {} as IQueryResult<IBooking>
  );
  const getItems = async () => {
    try {
      setLoading({ isLoading: true, loadingMessage: "getting items" });
      const res = await getData<IQueryResult<IBooking>>(
        queryBaseUrl,
        queryPayloadRef.current
      );
      setBookingsResult(res);
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
        {bookingsResult.data?.map((booking) => (
            <div
            key={booking.id}
          >
            <BookingCard showMenu={true} booking={booking} />
          </div>
         
        ))}

        {!bookingsResult.data?.length && (
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
        setQueryResult={setBookingsResult}
        limit={10}
        totalItems={bookingsResult.total}
      />
    </div>
  );
};
