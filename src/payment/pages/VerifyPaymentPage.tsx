import { IonButton, IonCol, IonContent, IonGrid, IonRow, useIonRouter } from "@ionic/react";
import { useAsyncHelpersContext } from "../../shared/contexts/async-helpers";
import { useLocation } from "react-router";
import { useEffect, useState } from "react";
import { IPaymentTransaction } from "../interfaces/payment";
import { APIBaseURL, getData } from "../../shared/api/base";
import { formatCurrency } from "../../utils";
import { PaymentPurpose } from "../enums/payment.enum";
import { UserRoutes } from "../../user/enums/routes.enum";
import { BookingRoutes } from "../../Booking/enums/routes";

export const VerifyPaymentPage = () => {
  const router = useIonRouter();
  const { setLoading, handleAsyncError } = useAsyncHelpersContext();
  const queryParams = new URLSearchParams(useLocation().search);
  const reference = queryParams.get("reference");
  //const provider = "paystack";
   const provider = useLocation().pathname?.split("/")[3];

  const [paymentTransaction, setPaymentTransaction] =
    useState<IPaymentTransaction>();

    const verifyTransaction = async () => {
    try {
      setLoading({ isLoading: true, loadingMessage: "verifying" });
      const res = await getData<IPaymentTransaction>(
        `${APIBaseURL}/transaction/verify-payment/${provider}`, {reference, txRef: reference}
      );
      setPaymentTransaction(res);
      setLoading({ isLoading: false, loadingMessage: "" });
      if (res.paymentPurpose === PaymentPurpose.FUND_DEPOSIT)
        router.push(`${UserRoutes.PROFILE}?ui=${res.profile?.userId}`);
      if (res.paymentPurpose === PaymentPurpose.SERVICE_PAYMENT)
        router.push(
          `${BookingRoutes.INVOICE}?bi=${res?.booking?.id}`
        );
    } catch (error) {
      handleAsyncError(error, "Error verifying transaction");
    }
  };

  useEffect(() => {
    verifyTransaction();
  }, [])
  
  return (
    <IonContent id="base-menu-content">
      <IonGrid>
        
    <IonRow>
      <IonCol size="12">
        <div className="ion-text-center">
          <span>Verifying Transaction with reference code </span>
          <div style={{ fontSize: "2em" }}>{reference}</div>
          {paymentTransaction && (
            <span>
              Payment Status: {paymentTransaction.paymentMethod}, amount:{" "}
              {formatCurrency(paymentTransaction.amount)}{" "}
              <IonButton
                expand="block"
                onClick={() => {
                  if (
                    paymentTransaction?.paymentPurpose ===
                    PaymentPurpose.FUND_DEPOSIT
                  )
                    router.push(
                      `${UserRoutes.PROFILE}?ui=${paymentTransaction.profile?.userId}`
                    );
                  if (
                    paymentTransaction?.paymentPurpose ===
                    PaymentPurpose.SERVICE_PAYMENT
                  )
                    router.push(
                      `${BookingRoutes.INVOICE}?bi=${paymentTransaction?.booking?.id}`
                    );
                }}
              >
                View Detail
              </IonButton>
            </span>
          )}
        </div>
      </IonCol>
    </IonRow>
      </IonGrid>
    </IonContent>
  );
};
