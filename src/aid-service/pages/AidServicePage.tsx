import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router";
import { IAidService } from "../interfaces/aid-service.interface";
import { IQueryResult } from "../../shared/interfaces/api-response";
import {
  IonCol,
  IonContent,
  IonFooter,
  IonGrid,
  IonHeader,
  IonRow,
  IonSearchbar,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { Pagination } from "../../shared/components/general/Pagination";
import { APIBaseURL, getData } from "../../shared/api/base";
import { useAsyncHelpersContext } from "../../shared/contexts/async-helpers";
import { AidServiceProfileCard } from "../components/AidServiceProfileCard";
import { IAidServiceProfile } from "../interfaces/aid-service-profile";
import { AidServiceCard } from "../components/AidServiceCard";
import { useAuthGuardContextStore } from "../../auth/contexts/AuthGuardContext";
import { ServiceProfiles } from "../components/ServiceProfiles";
import { ServiceCallRooms } from "../../call/components/ServiceCalls";
import { ServiceBookings } from "../../Booking/components/ServiceBookings";

export const AidServicePage = () => {
  const { setLoading, handleAsyncError } = useAsyncHelpersContext();
  const {isAdmin} = useAuthGuardContextStore();

  const queryParams = new URLSearchParams(useLocation().search);
  const aidServiceId = queryParams.get("asi");

  const [aidService, setAidService] = useState<IAidService>({} as IAidService);


  const [tabNumber, setTabNumber] = useState(1);
  const [queryObject, setQueryObject] = useState<{[key: string]: unknown}>({aidServiceId})

  const getAidService = async () => {
    try{
        setLoading({isLoading: true, loadingMessage: "fetching aid service"});
        const res = await getData<IAidService>(`${APIBaseURL}/aid-service/${aidServiceId}`);
        setAidService({...res});
        setLoading({isLoading: false, loadingMessage: ""});
    }catch(error){
        handleAsyncError(error, "Error fetching aid service");
    }
  }

  
   let tabs: { tabNumber: number; label: string }[] = [
    { tabNumber: 1, label: "Service Profiles" },
  ];
  if (isAdmin) {
    tabs = [
      ...tabs,
      { tabNumber: 2, label: "Bookings" },
      { tabNumber: 3, label: "Calls" },
    ];
  }

  useEffect(() => {
    getAidService()
    
  }, []);

  return (
    <>
      <IonHeader>
        <IonTitle>{aidService?.name}</IonTitle>
        <IonSearchbar
          placeholder="search providers of this service"
          aria-label="search for providers of this service"
          onIonInput={(evt) => {
            if((!evt.detail?.value) || evt.detail.value.length < 4) return;
            setQueryObject({...queryObject, searchTerm: evt.detail.value})
          }}
        />
      </IonHeader>
      
      <IonContent>
        <AidServiceCard aidService={aidService} />
        <IonGrid>
           <IonRow>
                  {tabs.map((item, index) => (
                    <IonCol key={index} size={"4"}>
                      <small role="button" onClick={() => setTabNumber(item.tabNumber)}>
                        {item.label}
                      </small>
                    </IonCol>
                  ))}
                </IonRow>
                <IonRow>
                  <IonCol size="12">
                    {tabNumber === 1 && (
                      <ServiceProfiles queryPayload={{ ...queryObject }} />
                    )}
                    {tabNumber === 2 && (
                      <ServiceBookings queryPayload={{ ...queryObject }} />
                    )}
                    {tabNumber === 3 && (
                      <ServiceCallRooms queryPayload={{ ...queryObject }} />
                    )}
                  </IonCol>
                </IonRow>
        </IonGrid>
      </IonContent>
    </>
  );
};
