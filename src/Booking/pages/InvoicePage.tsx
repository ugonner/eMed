import { useLocation } from "react-router";
import { useAsyncHelpersContext } from "../../shared/contexts/async-helpers";
import { useEffect, useState } from "react";
import { APIBaseURL, getData, postData } from "../../shared/api/base";
import { IBooking, PaymentStatus } from "../interfaces/booking";
import { IonButton, IonContent, IonItem } from "@ionic/react";
import { BookingInvoice } from "../components/BookingInvoice";
import { getLocalUser } from "../../utils";
import {
  PaymentMethod,
  PaymentPurpose,
} from "../../payment/enums/payment.enum";
import { usePayment } from "../../payment/hooks/payment";
import { NavigationBarGap } from "../../shared/components/partials/NavigationBarGap";

export const InvoicePage = () => {
  const queryParams = new URLSearchParams(useLocation().search);
  const bookingId = queryParams.get("bi");

  const {makePayment} = usePayment();

  const { setLoading, handleAsyncError } = useAsyncHelpersContext();

  const [booking, setBooking] = useState<IBooking>({} as IBooking);
  const user = getLocalUser();

  const getBooking = async () => {
    try {
      setLoading({ isLoading: true, loadingMessage: "fetching booking" });
      const res = await getData<IBooking>(`${APIBaseURL}/booking/${bookingId}`);
      setBooking(res);
      setLoading({ isLoading: false, loadingMessage: "" });
    } catch (error) {
      handleAsyncError(error, "Error getting booking");
    }
  };

  
  useEffect(() => {
    getBooking();
  }, []);

  return (
    <IonContent>
      <IonItem>
        <span slot="end">
          {booking?.paymentStatus}
          {user?.userId === booking?.profile?.userId &&
            booking.paymentStatus !== PaymentStatus.PAID && (
              <IonButton onClick={() => makePayment({
        amount: booking.totalAmount,
        paymentMethod: PaymentMethod.PAYSTACK,
        paymentPurpose: PaymentPurpose.SERVICE_PAYMENT,
        bookingId: Number(bookingId)
      })}>Pay Now</IonButton>
            )}
        </span>
      </IonItem>
      <BookingInvoice booking={booking} />
      <NavigationBarGap />
    </IonContent>
  );
};
