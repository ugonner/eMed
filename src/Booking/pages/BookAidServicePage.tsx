import { useLocation } from "react-router"
import { useAsyncHelpersContext } from "../../shared/contexts/async-helpers";
import { useEffect, useState } from "react";
import { IAidService } from "../../aid-service/interfaces/aid-service.interface";
import { IAidServiceProfile } from "../../aid-service/interfaces/aid-service-profile";
import { APIBaseURL, getData } from "../../shared/api/base";
import { IonCol, IonContent, IonGrid, IonHeader, IonPage, IonRow, IonTitle, IonToolbar } from "@ionic/react";
import { BookService } from "../components/BookService";

export const BookAidServicePage = () => {
    const {setLoading, handleAsyncError} = useAsyncHelpersContext();

    const queryParams = new URLSearchParams(useLocation().search);
    const aidServiceId = queryParams.get("asi");
    const aidServiceProfileId = queryParams.get("aspi");
    
    const [aidService, setAidService] = useState<IAidService>({} as IAidService);
    const [aidServiceProfile, setAidServiceProfile] = useState<IAidServiceProfile>();

    const getAidService = async () => {
        try{
            
            setLoading({isLoading: true, loadingMessage: "Fetching service"});
            const res = await getData<IAidService>(`${APIBaseURL}/aid-service/${aidServiceId}`);
            setAidService({...res});
            setLoading({isLoading: false, loadingMessage: ""});
            
        }catch(error){
            handleAsyncError(error, "Error getting aid sservice");
        }
    }

    const getAidServiceProfile = async () => {
        try{
            
            setLoading({isLoading: true, loadingMessage: "Fetching service provider"});
            const res = await getData<IAidServiceProfile>(`${APIBaseURL}/aid-service/profile/${aidServiceProfileId}`);
            setAidServiceProfile(res);
            setLoading({isLoading: false, loadingMessage: ""})
        }catch(error){
            handleAsyncError(error, "Error getting aid sservice provider");
        }
    }

    useEffect(() => {
        getAidService();
        if(aidServiceProfileId) getAidServiceProfile();
    }, [])
    return (
        <>
        <IonContent>
            <h3>Book Service</h3>
            <BookService aidService={aidService} aidServiceProfile={aidServiceProfile} />
        </IonContent>
                    
        
        </>
    )
}