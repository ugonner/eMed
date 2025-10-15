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
  calendarSharp,
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
} from "../../aid-service/components/LocationAddress";
import { ILocationAddress } from "../../aid-service/dtos/aid-service-profile.dto";
import { DateSelector } from "../../shared/components/form/DateSelector";
import { AidServiceProfileSelector } from "./AidServiceProfileSelector";
import { useAsyncHelpersContext } from "../../shared/contexts/async-helpers";
import { APIBaseURL, postData } from "../../shared/api/base";
import {
  formatServiceDurationKey,
  ServiceDurations,
} from "../datasets/service-durations";
import { LocationType } from "../enums/booking";
import { formatCamelCaseToSentence } from "../../shared/helpers";
import {
  VirtualLocationAddressCard,
  VirtualLocationAddressManager,
} from "./VirtualLocationManager";
import { VirtualLocationAddressDTO } from "../dtos/virtual-location.dto";
import { BookingCostCard } from "./BookingDetail";
import { IBooking } from "../interfaces/booking";
import { BookingRoutes } from "../enums/routes";

export interface IBookServieProps {
  aidService: IAidService;
  aidServiceProfile?: IAidServiceProfile;
}

export const BookService = ({
  aidService,
  aidServiceProfile,
}: IBookServieProps) => {
  const { setLoading, handleAsyncError } = useAsyncHelpersContext();
  const router = useIonRouter();

  const [pageNumber, setPageNumber] = useState(1);
  const [bookingDto, setBookingDto] = useState<BookingDTO>({} as BookingDTO);
  const [locationAddress, setLocationAddress] = useState<ILocationAddress>(
    bookingDto.locationAddress || {}
  );
  const [locationType, setLocationType] = useState<LocationType>(
    LocationType.ON_SITE
  );

  const selectedAidServiceRef = useRef<IAidService>(aidService);
  const selectedAidServiceProfileRef = useRef<IAidServiceProfile>(
    aidServiceProfile as IAidServiceProfile
  );

  const createBooking = async () => {
    try {
      setLoading({ isLoading: true, loadingMessage: "creating booking" });
      if (!selectedAidServiceRef.current.id)
        throw new Error("No valid aid service selected");

      bookingDto.aidServiceId = selectedAidServiceRef.current.id;
      bookingDto.aidServiceProfileId = selectedAidServiceProfileRef.current?.id;
      if (!bookingDto.startDate || !bookingDto.duration)
        throw new Error("Service date and time is required");
      bookingDto.duration = Number(bookingDto.duration);
      bookingDto.locationAddress = locationAddress;
      bookingDto.isVirtualLocation = (locationType === LocationType.VIRTUAL)
        

      const res = await postData<IBooking>(`${APIBaseURL}/booking`, {
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
      stageName: "Service Seletion",
      pageNumber: 1,
      icon: walkSharp,
    },
    {
      stageName: "Delivery Location",
      pageNumber: 2,
      icon: compassSharp,
    },
    {
      stageName: "Duration and Time",
      pageNumber: 3,
      icon: calendarSharp,
    },
    {
      stageName: "Provider (Optional)",
      pageNumber: 4,
      icon: personSharp,
    },
    {
      stageName: "Booking Review",
      pageNumber: 5,
      icon: folderOpenSharp,
    },
  ];

  useEffect(() => {
    selectedAidServiceRef.current = {
      ...aidService,
      ...(selectedAidServiceRef.current || {}),
    } as IAidService;
    selectedAidServiceProfileRef.current = {
      ...(aidServiceProfile || {}),
      ...(selectedAidServiceProfileRef.current || {}),
    } as IAidServiceProfile;
  }, [aidService, aidServiceProfile]);

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
                <AidServiceSelector
                  aidService={selectedAidServiceRef.current}
                  onSelection={(aService: IAidService) => {
                    selectedAidServiceRef.current = aService;
                    setBookingDto({ ...bookingDto, aidServiceId: aService.id });
                  }}
                />
              </div>
            )}
            {pageNumber === 2 && (
              <div>
                <IonItem>
                  <IonSelect
                    label="select location type"
                    labelPlacement="stacked"
                    value={locationType}
                    onIonChange={(evt) => {
                      setLocationType(evt.detail.value as LocationType);
                    }}
                  >
                    {Object.values(LocationType).map((item) => (
                      <IonSelectOption key={item} value={item}>
                        {formatCamelCaseToSentence(item)}
                      </IonSelectOption>
                    ))}
                  </IonSelect>
                </IonItem>
                <div>
                  <LocationAddressManager
                    locationAddress={locationAddress}
                    setLocationAddress={setLocationAddress}
                  />

                  <VirtualLocationAddressManager
                    virtualLocationAddress={bookingDto.virtualLocationAddress}
                    onSelection={(addr: VirtualLocationAddressDTO) => {
                      setBookingDto({
                        ...bookingDto,
                        virtualLocationAddress: addr,
                      });
                    }}
                  />
                </div>
              </div>
            )}
            {pageNumber === 3 && (
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
                <div>
                  <IonItem>
                    <IonLabel>
                      <h3>Maximum Duration of Service</h3>
                      <p> Select How Long This Service is intended to last </p>
                    </IonLabel>
                    <IonSelect
                      onIonChange={(evt) => {
                        setBookingDto({
                          ...bookingDto,
                          duration: Number(evt.detail.value),
                        });
                      }}
                      label="Maximum Duration of service"
                      labelPlacement="floating"
                      value={bookingDto.duration}
                    >
                      <IonSelectOption value={0}>Please select</IonSelectOption>
                      {Object.keys(ServiceDurations).map(
                        (durationKey, index) => (
                          <IonSelectOption
                          key={index}
                            value={
                              (ServiceDurations as { [key: string]: number })[
                                durationKey
                              ]
                            }
                          >
                            {" "}
                            {formatServiceDurationKey(durationKey)}{" "}
                          </IonSelectOption>
                        )
                      )}
                    </IonSelect>
                  </IonItem>
                </div>
              </div>
            )}
            {pageNumber === 4 && (
              <div>
                {bookingDto.aidServiceId && bookingDto.startDate ? (
                  <AidServiceProfileSelector
                    aidServiceProfile={
                      selectedAidServiceProfileRef.current ||
                      ({} as IAidServiceProfile)
                    }
                    bookingDto={bookingDto}
                    onSelection={(aProfile: IAidServiceProfile) => {
                      selectedAidServiceProfileRef.current = aProfile;
                      setBookingDto({
                        ...bookingDto,
                        aidServiceProfileId: aProfile.id,
                      });
                    }}
                  />
                ) : (
                  <div>
                    {" "}
                    Service and Service Date and Time MUST be set first before
                    selecting a provider
                  </div>
                )}
              </div>
            )}
            {pageNumber === 5 && (
              <div>
                <h3>Review Booking</h3>
                <p>
                  {" "}
                  Service Name:{" "}
                  <span style={{ fontWeight: "bold" }}>
                    {selectedAidServiceRef.current.name}
                  </span>
                </p>
                <p>
                  {" "}
                  Service Date and Time:{" "}
                  <span style={{ fontWeight: "bold" }}>
                    {bookingDto.startDate?.split("T")[0]} |{" "}
                    {bookingDto.startDate?.split("T")[1]?.split(".")[0]}{" "}
                  </span>{" "}
                </p>
                <LocationAddressCard locationAddress={locationAddress} />
                <VirtualLocationAddressCard
                  virtualLocationAddress={bookingDto.virtualLocationAddress}
                />
                {selectedAidServiceProfileRef.current?.id && (
                  <p>
                    Service Provider:{" "}
                    <span style={{ fontWeight: "bold" }}>
                      {selectedAidServiceProfileRef.current?.name}
                    </span>{" "}
                  </p>
                )}
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
