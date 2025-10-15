import {
  IonAvatar,
  IonCol,
  IonGrid,
  IonIcon,
  IonImg,
  IonItem,
  IonLabel,
  IonRow,
} from "@ionic/react";
import { IBooking } from "../interfaces/booking";
import { defaultAidServiceImageUrl } from "../../aid-service/components/AidServiceCard";
import { getBookingFields } from "../datasets/booking-fields";
import { squareSharp } from "ionicons/icons";
import { ServiceDurations } from "../datasets/service-durations";
import { formatCamelCaseToSentence } from "../../shared/helpers";
import { BookingActionsMenu } from "./BookingActionsMenu";
import { BookingRoutes } from "../enums/routes";

export interface IBookingCardProps {
  booking: IBooking;
  showMenu?: boolean;
}

export const BookingCard = ({ booking, showMenu }: IBookingCardProps) => {
  const bookingFields = getBookingFields(booking);

  return (
    <IonGrid>
      <IonRow>
        <IonCol size={showMenu ? "11" : "12"}>
          <IonItem
           routerLink={`${BookingRoutes.INVOICE}?bi=${booking.id}`}
          >
            
            <IonAvatar>
              <IonImg
                src={booking.aidService?.avatar || defaultAidServiceImageUrl}
                alt={booking.aidService?.name}
              />
            </IonAvatar>
            <IonLabel className="ion-margin-horizontal">
              <h3>{booking.aidService?.name}</h3>
            </IonLabel>
          </IonItem>
          <IonItem>
            <IonLabel>
              <div style={{display: "flex"}}>
                <div>
                {bookingFields.slice(0, 2).map((item, index) => (
                  <div key={index} style={{fontSize: "0.5em"}}>
                    <IonIcon className="ion-margin-horizontal" icon={item.icon || squareSharp}></IonIcon>
                    <span>{formatCamelCaseToSentence(item.name)}:</span>

                    <span style={{ fontWeight: "bold" }}>
                      {(
                        <span>{item.value as string}</span>
                      )}
                    </span>
                  </div>
                ))}
              </div>
              <div>
                {bookingFields.slice(2).map((item, index) => (
                  <div key={index} style={{fontSize: "0.5em"}}>
                    <IonIcon className="ion-margin-horizontal" icon={item.icon || squareSharp}></IonIcon>
                    <span>{formatCamelCaseToSentence(item.name)}:</span>

                    <span style={{ fontWeight: "bold" }}>
                      {(
                        <span>{item.value as string}</span>
                      )}
                    </span>
                  </div>
                ))}
              </div>
              </div>
            </IonLabel>
          </IonItem>
        </IonCol>
        {
          showMenu && (
            <IonCol size="1">
              <BookingActionsMenu booking={booking} />
            </IonCol>
          )
        }
      </IonRow>
    </IonGrid>
  );
};
