import { IonIcon, IonItem, useIonRouter } from "@ionic/react";
import { IPaymentTransaction } from "../interfaces/payment";
import { getTransactionFields } from "../utils";
import { PaymentPurpose } from "../enums/payment.enum";
import { BookingRoutes } from "../../Booking/enums/routes";
import { UserRoutes } from "../../user/enums/routes.enum";

export interface IPaymentTransactionCardProps {
  paymentTransaction: IPaymentTransaction;
}

export const PaymentTransactionCard = ({
  paymentTransaction,
}: IPaymentTransactionCardProps) => {
  const router = useIonRouter();

  const transactionFieldItems = getTransactionFields(paymentTransaction);

  return (
    <div>
      <div
        role="button"
        aria-label={
          paymentTransaction.paymentPurpose === PaymentPurpose.SERVICE_PAYMENT
            ? "Open Booking"
            : "Open Profile"
        }
        onClick={() => {
          const url =
            paymentTransaction.paymentPurpose === PaymentPurpose.SERVICE_PAYMENT
              ? `${BookingRoutes.INVOICE}?bi=${paymentTransaction.booking?.id}`
              : `${UserRoutes.PROFILE}?ui=${paymentTransaction.profile?.userId}`;
          router.push(url);
        }}
        style={{ display: "flex", alignItems: "start" }}
      >
        <div className="ion-margin-horizontal">
          {transactionFieldItems.slice(0,3).map((item) => (
            <p key={item.name} style={{lineHeight: "0.25em"}}>
              <IonIcon icon={item.icon}></IonIcon>
              <span className="ion-margin-horizontal">{item.name}:</span>
              <span style={{ fontWeight: "bold" }}>{item.value as string}</span>
            </p>
          ))}
        </div>
        <div>
          {transactionFieldItems.slice(3).map((item) => (
            <p key={item.name} style={{lineHeight: "0.25em"}}>
              <IonIcon icon={item.icon}></IonIcon>
              <span className="ion-margin-horizontal">{item.name}:</span>
              <span style={{ fontWeight: "bold" }}>{item.value as string}</span>
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};
