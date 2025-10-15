import { IonContent } from "@ionic/react";
import { useLocation } from "react-router"
import { ProfileApplicationManager } from "../components/ProfileApplicationManager";

export const ProfileApplicationPage = () => {
    const queryParams = new URLSearchParams(useLocation().search);
    const aidServiceId = Number(queryParams.get("aidServiceId")) || 0;

    return (
        <IonContent>
            <ProfileApplicationManager aidServiceIdNumber={aidServiceId} />
        </IonContent>
    )
}