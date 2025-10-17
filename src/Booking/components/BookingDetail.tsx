import {
  IonAvatar,
  IonCol,
  IonGrid,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonRow,
} from "@ionic/react";
import { IBooking } from "../interfaces/booking";
import { BookingActionsMenu } from "./BookingActionsMenu";
import { BookingCard } from "./BookingCard";
import { LocationAddressCard } from "./LocationAddress";
import { VirtualLocationAddressCard } from "./VirtualLocationManager";
import { getBookingFields } from "../datasets/booking-fields";
import { squareSharp, starSharp } from "ionicons/icons";
import { formatCamelCaseToSentence } from "../../shared/helpers";
import { AidServiceProfileCard } from "../../aid-service/components/AidServiceProfileCard";
import { getNumberRange } from "../../shared/components/form/DateSelector";
import { formatCurrency } from "../../utils";
import { ServiceDurations } from "../datasets/service-durations";

export interface IBookingDetailProps {
  booking: IBooking;
}

export const BookingDetail = ({ booking }: IBookingDetailProps) => {
  const advancedBookingFields = getBookingFields(booking, true);
  const ratingRange = getNumberRange(1, booking.rating || 1);

  return (
    <IonGrid>
      <IonRow>
        <IonCol size="11">
          <BookingCard booking={booking} />
        </IonCol>
        <IonCol size="1">
          <BookingActionsMenu booking={booking} />
        </IonCol>
      </IonRow>
      <IonRow>
        <IonCol size="6">
          <LocationAddressCard locationAddress={booking.locationAddress} />
        </IonCol>
      </IonRow>

      <IonRow>
        <IonCol size="6">
          {advancedBookingFields.slice(0, 5).map((item, index) => (
            <IonItem key={index}>
              <IonAvatar>
                <IonIcon icon={item.icon || squareSharp}></IonIcon>
              </IonAvatar>
              <IonLabel>
                <h3>{formatCamelCaseToSentence(item.name)}</h3>
                <p>{item.value as string}</p>
              </IonLabel>
            </IonItem>
          ))}
        </IonCol>
        <IonCol size="6">
          {advancedBookingFields.slice(5).map((item, index) => (
            <IonItem key={index}>
              <IonAvatar>
                <IonIcon icon={item.icon || squareSharp}></IonIcon>
              </IonAvatar>
              <IonLabel>
                <h3>{formatCamelCaseToSentence(item.name)}</h3>
                <p>{item.value as string}</p>
              </IonLabel>
            </IonItem>
          ))}
        </IonCol>
      </IonRow>

      <IonRow>
        <IonCol size="12">
          <h3>Matched Provider</h3>
          {booking.aidServiceProfile?.id ? (
            <AidServiceProfileCard
              aidServiceProfile={booking.aidServiceProfile || {}}
            />
          ) : (
            <p>No Service Provider Matched Yet</p>
          )}
        </IonCol>
        <IonCol size="12"></IonCol>
      </IonRow>
      <IonRow>
        <IonCol size="12">
          <h3>Rating and Review</h3>
        </IonCol>

        <IonCol size="3">
          <div className="ion-text-center">
            <span style={{ fontSize: "3em" }}>{booking.rating}</span>
            <br />
            {ratingRange.map((item) => (
              <IonIcon key={item} icon={starSharp}></IonIcon>
            ))}
          </div>
        </IonCol>
        <IonCol size="9">
          <p>{booking.review}</p>
        </IonCol>
      </IonRow>
      <IonRow>
        <IonCol size="12">
          <BookingCostCard booking={booking} />
        </IonCol>
      </IonRow>
    </IonGrid>
  );
};

export const BookingCostCard = ({ booking }: { booking: IBooking }) => {
  const taxRate = 7.5;
  const serviceRate = Number(booking.aidService?.serviceRate);
  const taxCost = (taxRate / 100) * serviceRate;

    const transportationCost = /Anambra/i.test(booking.locationAddress?.state || "")
      ? 5000
      : 10000;
  const subTotal = serviceRate + transportationCost
  const totalAmount = serviceRate + taxCost + transportationCost;

  return (
    <IonList>
      <IonItem>
        <span>
          Service Rate
        </span>
        <span slot="end">{formatCurrency(serviceRate, "NGN")}</span>
      </IonItem>
      <IonItem>
        <span>
          Transport Rate
        </span>
        <span slot="end">{formatCurrency(transportationCost, "NGN")}</span>
      </IonItem>

      <IonItem>
        <span>Sub Total</span>
        <span slot="end">{formatCurrency(subTotal, "NGN")}</span>
      </IonItem>

      <IonItem>
        <span>Total</span>
        <IonLabel slot="end">
          <p>
            {taxRate}% VAT = {formatCurrency(taxCost, "NGN")}
          </p>
          {formatCurrency(Number(booking.totalAmount || totalAmount), "NGN")}
        </IonLabel>
      </IonItem>
    </IonList>
  );
};
