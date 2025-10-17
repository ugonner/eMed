import { useState } from "react";
import { useAsyncHelpersContext } from "../../shared/contexts/async-helpers";
import { IBooking } from "../interfaces/booking";
import { APIBaseURL, postData } from "../../shared/api/base";
import { IonButton, IonInput, IonItem, IonSelect, IonSelectOption } from "@ionic/react";
import { BookingStatus } from "../enums/booking";

export interface IBookingStatusUpdate {
    bookingStatus: BookingStatus;
    bookingStatusNote?: string;
  }
  export interface IUpdateBookingStatusProps {
    booking: IBooking;
    onCompletion: () => void;
  }

  export const UpdateBookingStatus = ({booking, onCompletion}: IUpdateBookingStatusProps) => {
    const {setLoading, handleAsyncError} = useAsyncHelpersContext();

    const [bookingStatusDto, setBookingStatusDto] = useState<IBookingStatusUpdate>({
        bookingStatus: booking.bookingStatus,
        bookingStatusNote: booking.bookingStatusNote
    })

    const updateBookingStatus = async () => {
        try{
            setLoading({isLoading: true, loadingMessage: "updating booking status"});
            await postData(`${APIBaseURL}/booking/${booking.id}/update-status`, {
                method: "put",
                ...bookingStatusDto
            });
            setLoading({isLoading: false, loadingMessage: ""})
            if(onCompletion) onCompletion();
        }catch(error){
            handleAsyncError(error, "Error updating Booking status")
        }
    }

    return (
        <div>
            <h3>Update Booking Status</h3>
            <IonItem>
                <IonSelect
                value={bookingStatusDto.bookingStatus}
                onIonChange={(evt) => {
                    setBookingStatusDto({...bookingStatusDto, bookingStatus: evt.detail.value as BookingStatus})
                }}
                label="Select Booking Status"
                labelPlacement="stacked"
                >
                    {
                        Object.values(BookingStatus).map((item, index) => (
                            <IonSelectOption key={index} value={item}>{item.replace("_", " ")}</IonSelectOption>
                        ))
                    }
                </IonSelect>
            </IonItem>
            <IonItem>
                <IonInput
                label="Add Comment about the Booking Status"
                labelPlacement="stacked"
                value={bookingStatusDto.bookingStatusNote}
                onIonInput={(evt) => {
                    setBookingStatusDto({...bookingStatusDto, bookingStatusNote: evt.detail.value as string})
                }}
                />
            </IonItem>
            <IonButton
            expand="full"
            onClick={() => updateBookingStatus()}
            >
                Update Status
            </IonButton>
        </div>
    )
  }