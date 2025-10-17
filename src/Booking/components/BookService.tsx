import { useEffect, useRef, useState } from "react";
import { IAidService } from "../../aid-service/interfaces/aid-service.interface";
import {
  IonButton,
  IonCol,
  
  IonGrid,
  IonIcon,
  IonItem,
  IonLabel,
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
  compassSharp,
  folderOpenSharp,
  personSharp,
  walkSharp,
} from "ionicons/icons";
import { AidServiceSelector } from "./AidServiceSelector";
import { BookingDTO } from "../dtos/booking.dto";
import {
  LocationAddressCard,
  LocationAddressManager,
} from "./LocationAddress";
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
  booking?: IBooking
}

export const BookService = ({
  aidService,
  booking,
}: IBookServieProps) => {
  const { setLoading, handleAsyncError } = useAsyncHelpersContext();
  const router = useIonRouter();

  const [pageNumber, setPageNumber] = useState(1);
  const [bookingDto, setBookingDto] = useState<BookingDTO>( {} as BookingDTO);
  const [locationAddress, setLocationAddress] = useState<ILocationAddress>(
    bookingDto.locationAddress || {}
  );
 
  const selectedAidServiceRef = useRef<IAidService>(aidService);
 
  const createBooking = async () => {
    try {
      setLoading({ isLoading: true, loadingMessage: "creating booking" });
      if (!selectedAidServiceRef.current.id)
        throw new Error("No valid aid service selected");

      bookingDto.aidServiceId = selectedAidServiceRef.current.id;
      if (!bookingDto.startDate)
        throw new Error("Service date and time is required");
      bookingDto.locationAddress = locationAddress;
        

      const res = booking?.id ? await postData<IBooking>(`${APIBaseURL}/booking/${booking.id}`, {
        method: "put",
        ...bookingDto,
      }) : await postData<IBooking>(`${APIBaseURL}/booking`, {
        method: "post",
        ...bookingDto,
      });
      setLoading({ isLoading: false, loadingMessage: "" });
      router.push(`${BookingRoutes.INVOICE}?bi=${res.id}`)
    } catch (error) {
      handleAsyncError(error, "Error creating booking");
    }
  };
  const bookingStages: {
    stageName: string;
    pageNumber: number;
    icon?: string;
  }[] = [
    {
      stageName: "Booking Information",
      pageNumber: 1,
      icon: compassSharp,
    },
    {
      stageName: "Booking Review",
      pageNumber: 2,
      icon: folderOpenSharp,
    },
  ];

  useEffect(() => {
    selectedAidServiceRef.current = {
      ...aidService,
      ...(selectedAidServiceRef.current || {}),
    } as IAidService;
    if(booking?.id) {
      bookingDto.locationAddress = booking.locationAddress;
      bookingDto.startDate = booking.startDate;
    }
    }, [aidService, booking]);

  return (
    <div>
      <IonGrid>
        <IonRow>
          {bookingStages.map((stage) => (
            <IonCol key={stage.stageName}>
              <div
              color={stage.pageNumber === pageNumber ? "primary" : ""}
                role="button"
                aria-label={`navigate to ${stage.stageName}`}
                onClick={() => setPageNumber(stage.pageNumber)}
              >
                <IonIcon
                  size="small"
                  icon={stage.icon}
                  className="ion-margin-horizontal"
                ></IonIcon>
                <IonLabel> <small>{stage.stageName}</small> </IonLabel>
              </div>
            </IonCol>
          ))}
        </IonRow>
        <IonRow>
          <IonCol size="12">
           {pageNumber === 1 && (
              <div>
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
              </div>
            )}
            {pageNumber === 2 && (
              <div>
                <h3>Review Booking</h3>
                <div>
                <AidServiceSelector
                  aidService={selectedAidServiceRef.current}
                  onSelection={(aService: IAidService) => {
                    selectedAidServiceRef.current = aService;
                    setBookingDto({ ...bookingDto, aidServiceId: aService.id });
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
                  <BookingCostCard booking={{...bookingDto, aidService: selectedAidServiceRef.current} as unknown as IBooking} />
                </div>
                <p>
                  <IonButton expand="full" onClick={createBooking}>
                    Create Booking
                  </IonButton>
                </p>
              </div>
            )}
          </IonCol>
        </IonRow>
        <IonRow>
          {
            [1,2].map((item) => (
              <IonCol size="6" key={item}>
                <IonButton
                fill="clear"
                onClick={() => {
                  if(item === 1 && (pageNumber - 1 > 0)) setPageNumber((pageNumber - 1));
                  else if(item === 2 && (pageNumber + 1 <= (bookingStages.length))) setPageNumber((pageNumber + 1));
                }}
                >
                  <IonLabel>
                    <small>
                      
                  <IonIcon icon={item === 1 ? arrowBack : arrowForward}></IonIcon>
                  <span className="ion-margin-horizontal">
                    {item === 1 
                    ? 
                    `Back: ${bookingStages[pageNumber - 2] ? bookingStages[pageNumber - 2].stageName : "None"} ` 
                    : 
                    `Next: ${bookingStages[pageNumber] ? bookingStages[pageNumber].stageName : "End"}`}</span>
                    </small>
                  </IonLabel>
                </IonButton>
              </IonCol>
            ))
          }
        </IonRow>
      </IonGrid>
    </div>
  );
};
