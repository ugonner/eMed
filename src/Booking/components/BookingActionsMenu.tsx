import { useEffect, useRef, useState } from "react";
import { IAidService } from "../../aid-service/interfaces/aid-service.interface";
import { useAsyncHelpersContext } from "../../shared/contexts/async-helpers";
import { getLocalUser } from "../../utils";
import { IBooking } from "../interfaces/booking";
import { useAuthGuardContextStore } from "../../auth/contexts/AuthGuardContext";
import { BookingMenuActions, BookingStatus } from "../enums/booking";
import {
  IonButton,
  IonContent,
  IonIcon,
  IonItem,
  IonList,
  IonModal,
  IonPopover,
  useIonRouter,
} from "@ionic/react";
import { book, ellipsisVertical } from "ionicons/icons";
import { APIBaseURL, postData } from "../../shared/api/base";
import { ReviewAndRate } from "../../review/components/ReviewndRating";
import { ServiceType } from "../../review/enums/service";
import { CreateReport } from "../../report/components/CreateReport";
import { BookingRoutes } from "../enums/routes";
import { IBookingStatusUpdate, UpdateBookingStatus } from "./UpdateBookingStatus";

export interface IBookingActionsMenuProps {
  booking: IBooking;
}

export const BookingActionsMenu = ({ booking }: IBookingActionsMenuProps) => {
  const { setLoading, handleAsyncError } = useAsyncHelpersContext();
  const { isAdmin } = useAuthGuardContextStore();
  const router = useIonRouter();

  const actionsListRef = useRef<BookingMenuActions[]>([]);

  const [openMenuOverlay, setOpenMenuOverlay] = useState(false);
  const [openActionOverlay, setOpenActionOverlay] = useState(false);
  const [updateStatusDto, setUpdateStatusDto] = useState<IBookingStatusUpdate>({} as IBookingStatusUpdate);

  const currentActionRef = useRef<BookingMenuActions>();

  const user = getLocalUser();
  const isOwner = booking.profile?.userId === user?.userId;
  const isProvider =
    booking.aidServiceProfile?.profile?.userId === user?.userId;

  const takeAction = async (action: BookingMenuActions) => {
    try {
      setLoading({ isLoading: true, loadingMessage: action });
      if(action === BookingMenuActions.TRACK_BOOKING && (!booking.locationAddress?.latitude)) throw new Error("Booking has no tracking location co-ordinates");
      if(action === BookingMenuActions.TRACK_BOOKING) router.push(`${BookingRoutes.TRACK_LOCATION}?lat=${booking.locationAddress?.latitude}&lon=${booking.locationAddress?.longitude}`);
      else if (action === BookingMenuActions.EDIT) {
        router.push(`${BookingRoutes.BOOK_SERVICE}?bi=${booking.id}&asi=${booking.aidService?.id}`);
      }else if (action === BookingMenuActions.UPDATE_STATUS) {
        await postData(`${APIBaseURL}/booking/${booking.id}/status`, {
          method: "put",
          ...updateStatusDto,
        });
      } else if (action === BookingMenuActions.CONFIRM_BY_CUSTOMER) {
        const confirmedBy = "user" 
        await postData(
          `${APIBaseURL}/booking/${booking.id}/${confirmedBy}/confirm`,
          {
            method: "put",
          }
        );
      } else if (action === BookingMenuActions.CONFIRM_BY_PROVIDER) {
        const confirmedBy = "provider" 
        await postData(
          `${APIBaseURL}/booking/${booking.id}/${confirmedBy}/confirm`,
          {
            method: "put",
          }
        );
      } else if (action === BookingMenuActions.MATCH_PROVIDER) {
        await postData(`${APIBaseURL}/booking/${booking.id}/match`, {
          method: "put",
        });
      }
      setLoading({ isLoading: false, loadingMessage: "" });
    } catch (error) {
      handleAsyncError(error, `Error on action: ${action}`);
    }
  };

  useEffect(() => {
    actionsListRef.current = [];
    if (isProvider || isAdmin) {
      actionsListRef.current = [
        BookingMenuActions.TRACK_BOOKING,
        BookingMenuActions.CONFIRM_BY_PROVIDER,
      ];
    }
    if (isOwner || isAdmin) {
      actionsListRef.current = [
        BookingMenuActions.EDIT,
        BookingMenuActions.CONFIRM_BY_CUSTOMER,
        ...actionsListRef.current,
        BookingMenuActions.RATING_AND_REVIEW,
        BookingMenuActions.REPORT,
      ];
    }
    if (isAdmin) {
      actionsListRef.current = [
        ...actionsListRef.current,
        BookingMenuActions.MATCH_PROVIDER,
        BookingMenuActions.UPDATE_STATUS
      ];
    }
  }, [booking]);

  return (
    <div>
      <div
        id={`booking-menu-toggler-${booking.id}`}
        role="button"
        aria-label="open menu"
        aria-haspopup={true}
        aria-expanded={openMenuOverlay}
        onClick={() => setOpenMenuOverlay(!openMenuOverlay)}
      >
        <IonIcon icon={ellipsisVertical}></IonIcon>
      </div>

      <IonPopover
        isOpen={openMenuOverlay}
        onDidDismiss={() => setOpenMenuOverlay(false)}
        trigger={`booking-menu-toggler-${booking.id}`}
      >
        <IonList>
          {actionsListRef.current.map((item) => (
            <IonItem
            key={item}
              role="button"
              onClick={() => {
                currentActionRef.current = item;
                setOpenMenuOverlay(false);
                setOpenActionOverlay(true);
              }}
            >
              <span>{item}</span>
            </IonItem>
          ))}
        </IonList>
      </IonPopover>

      <IonModal
        isOpen={openActionOverlay}
        onDidDismiss={() => setOpenActionOverlay(false)}
      >
        <IonContent>
          <h2 className="ion-text-center">{currentActionRef.current}</h2>
          {(![
            BookingMenuActions.UPDATE_STATUS,
            BookingMenuActions.REPORT,
            BookingMenuActions.RATING_AND_REVIEW,
            
          ].includes(currentActionRef.current as BookingMenuActions)) && (
            <>
            <p className="io-text-center">Confirm and Proceed with this action, Click "confirm" to proceed or "cancel" to ignore</p>
              {["confirm", "cancel"].map((item) => (
                <IonButton
                  key={item}
                  expand="full"
                  onClick={() => {
                    if (item === "confirm")
                      takeAction(
                        currentActionRef.current as BookingMenuActions
                      );
                    setOpenActionOverlay(false);
                  }}
                >
                  {item}
                </IonButton>
              ))}
            </>
          )}

          {currentActionRef.current ===
            BookingMenuActions.UPDATE_STATUS && (
            <UpdateBookingStatus
            booking={booking}
            onCompletion={() => setOpenActionOverlay(false)}
            />
          )}

          {currentActionRef.current ===
            BookingMenuActions.RATING_AND_REVIEW && (
            <ReviewAndRate
              serviceType={ServiceType.BOOKING}
              serviceTypeEntityId={booking.id}
              onCompletion={() => setOpenActionOverlay(false)}
            />
          )}

          {currentActionRef.current === BookingMenuActions.REPORT && (
            <CreateReport
              serviceType={ServiceType.BOOKING}
              serviceTypeEntityId={booking.id}
              onCompletion={() => setOpenActionOverlay(false)}
            />
          )}
        </IonContent>
      </IonModal>
    </div>
  );
};
