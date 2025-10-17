import { useEffect, useRef } from "react";
import { LocationAddressCard } from "./LocationAddress";
import { ILocationAddress } from "../../aid-service/dtos/aid-service-profile.dto";
import { getLocalUser } from "../../utils";
import { IBooking } from "../interfaces/booking";
import { BookingDetail } from "./BookingDetail";

export interface IBookingInvoiceProps {
  booking: IBooking;
}

export const BookingInvoice = ({ booking }: IBookingInvoiceProps) => {
  const bookingRef = useRef<IBooking>(booking);
  const user = getLocalUser();

  useEffect(() => {
    bookingRef.current = booking;
  }, [booking]);
  return (
    <div>
      <BookingDetail booking={bookingRef.current} />
  
    </div>
  );
};
