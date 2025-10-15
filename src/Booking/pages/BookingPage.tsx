import { useLocation } from "react-router"
import { useAsyncHelpersContext } from "../../shared/contexts/async-helpers";
import { useEffect, useState } from "react";
import { APIBaseURL, getData } from "../../shared/api/base";
import { IBooking } from "../interfaces/booking";
import { IonContent } from "@ionic/react";
import { BookingInvoice } from "../components/BookingInvoice";
import { BookingDetail } from "../components/BookingDetail";

export const BookingPage = () => {
    const queryParams = new URLSearchParams(useLocation().search);
    const bookingId = queryParams.get("bi");

    const {setLoading, handleAsyncError} = useAsyncHelpersContext();

    const [booking, setBooking] = useState<IBooking>({} as IBooking)
    const getBooking = async () => {
        try{
            setLoading({isLoading: true, loadingMessage: "fetching booking"});
            const res = await getData<IBooking>(`${APIBaseURL}/booking/${bookingId}`);
            setBooking(res);
            setLoading({isLoading: false, loadingMessage: ""})
        }catch(error){
            handleAsyncError(error, "Error getting booking");
        }
    }
    useEffect(() => {
        getBooking();
    }, [])

    return (
        <IonContent>
            <BookingDetail booking={booking} />
        </IonContent>
    )
}