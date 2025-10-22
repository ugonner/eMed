import { useEffect, useRef, useState } from "react";
import { IAidService } from "../../aid-service/interfaces/aid-service.interface";
import {
  IonButton,
  IonCol,
  IonContent,
  IonGrid,
  IonIcon,
  IonItem,
  IonLabel,
  IonModal,
  IonRow,
  IonSelect,
  IonSelectOption,
  IonTextarea,
  useIonRouter,
} from "@ionic/react";
import { IAidServiceProfile } from "../../aid-service/interfaces/aid-service-profile";
import {
  arrowBack,
  arrowForward,
  closeCircle,
  compassSharp,
  folderOpenSharp,
  personSharp,
  walkSharp,
} from "ionicons/icons";
import { AidServiceSelector } from "./AidServiceSelector";
import { BookingDTO } from "../dtos/booking.dto";
import { LocationAddressCard, LocationAddressManager } from "./LocationAddress";
import { ILocationAddress } from "../../aid-service/dtos/aid-service-profile.dto";
import { DateSelector } from "../../shared/components/form/DateSelector";
import { AidServiceProfileSelector } from "./AidServiceProfileSelector";
import { useAsyncHelpersContext } from "../../shared/contexts/async-helpers";
import { APIBaseURL, postData } from "../../shared/api/base";
import { BookingCostCard } from "./BookingDetail";
import { IBooking } from "../interfaces/booking";
import { BookingRoutes } from "../enums/routes";

export interface IBookServieProps {
  aidService: IAidService;
  booking?: IBooking;
}

export const BookService = ({ aidService, booking }: IBookServieProps) => {
  const { setLoading, handleAsyncError } = useAsyncHelpersContext();
  const router = useIonRouter();

  const [bookingDto, setBookingDto] = useState<BookingDTO>({} as BookingDTO);
  const [locationAddress, setLocationAddress] = useState<ILocationAddress>(
    bookingDto.locationAddress || {}
  );
  const [openReviewOverlay, setOpenReviewOverlay] = useState(false);

  const selectedAidServiceRef = useRef<IAidService>(aidService);

  const createBooking = async () => {
    try {
      if (!selectedAidServiceRef.current.id)
        throw new Error("No valid aid service selected");

      bookingDto.aidServiceId = selectedAidServiceRef.current.id;
      if (!bookingDto.startDate)
        throw new Error("Service date and time is required");
      if((!locationAddress?.street?.trim()?.length) || (!locationAddress?.city?.trim()?.length)) throw new Error("Street and city are required");

      bookingDto.locationAddress = locationAddress;
      
      setLoading({ isLoading: true, loadingMessage: "creating booking" });
    
      const res = booking?.id
        ? await postData<IBooking>(`${APIBaseURL}/booking/${booking.id}`, {
            method: "put",
            ...bookingDto,
          })
        : await postData<IBooking>(`${APIBaseURL}/booking`, {
            method: "post",
            ...bookingDto,
          });
      setLoading({ isLoading: false, loadingMessage: "" });
      router.push(`${BookingRoutes.INVOICE}?bi=${res.id}`);
    } catch (error) {
      handleAsyncError(error, "Error creating booking");
    }
  };
  
  useEffect(() => {
    selectedAidServiceRef.current = {
      ...aidService,
      ...(selectedAidServiceRef.current || {}),
    } as IAidService;
    if (booking?.id) {
      bookingDto.locationAddress = booking.locationAddress;
      bookingDto.startDate = booking.startDate;
    }
  }, [aidService, booking]);

  return (
    <div>
      <IonGrid>
        <IonRow>
          <IonCol size="12">
              <div>
                 <div>
                  <AidServiceSelector
                    aidService={selectedAidServiceRef.current}
                    onSelection={(aService: IAidService) => {
                      selectedAidServiceRef.current = aService;
                      setBookingDto({
                        ...bookingDto,
                        aidServiceId: aService.id,
                      });
                    }}
                  />
                </div>
               
                <div>
                  <LocationAddressManager
                    locationAddress={locationAddress}
                    setLocationAddress={setLocationAddress}
                  />
                </div>
                <div>
                  <DateSelector
                    label="Select the date and time for the service"
                    initDate={new Date(bookingDto.startDate || Date.now())}
                    onSelection={(seletedDate: Date) => {
                      setBookingDto({
                        ...bookingDto,
                        startDate: seletedDate.toISOString(),
                      });
                    }}
                  />
                </div>
                <IonButton aria-haspopup={true} aria-expanded={openReviewOverlay} expand="full" onClick={() => setOpenReviewOverlay(!openReviewOverlay)}>
                  Review Booking
                </IonButton>
              </div>
            
          </IonCol>
        </IonRow>
      </IonGrid>

      <IonModal
      isOpen={openReviewOverlay}
      onDidDismiss={() => setOpenReviewOverlay(false)}
      >
        <IonContent>
          <IonItem>
            <IonButton
            fill="clear"
            aria-label="close"
            slot="end"
            onClick={() => setOpenReviewOverlay(false)}
            >
              <IonIcon icon={closeCircle}></IonIcon>
            </IonButton>
          </IonItem>
          <h2>Review And Create Booking Request</h2>
              <div>
                <h3>Review Booking</h3>
                <div>
                  <AidServiceSelector
                    aidService={selectedAidServiceRef.current}
                    onSelection={(aService: IAidService) => {
                      selectedAidServiceRef.current = aService;
                      setBookingDto({
                        ...bookingDto,
                        aidServiceId: aService.id,
                      });
                    }}
                  />
                </div>
                <p>
                  {" "}
                  Service Date and Time:{" "}
                  <span style={{ fontWeight: "bold" }}>
                    {bookingDto.startDate?.split("T")[0]} |{" "}
                    {bookingDto.startDate?.split("T")[1]?.split(".")[0]}{" "}
                  </span>{" "}
                </p>
                <LocationAddressCard locationAddress={locationAddress} />

                <IonItem>
                  <IonTextarea
                    label="Any additional Notes For This Service"
                    labelPlacement="floating"
                    value={bookingDto.bookingNote}
                    onIonInput={(evt) => {
                      setBookingDto({
                        ...bookingDto,
                        bookingNote: evt.detail.value as string,
                      });
                    }}
                  />
                </IonItem>
                <div>
                  <BookingCostCard
                    booking={
                      {
                        ...bookingDto,
                        aidService: selectedAidServiceRef.current,
                      } as unknown as IBooking
                    }
                  />
                </div>
                <p>
                  <IonButton expand="full" onClick={createBooking}>
                    Create Booking
                  </IonButton>
                </p>
              </div>

        </IonContent>
      </IonModal>
    </div>
  );
};
