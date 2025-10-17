import { IonContent } from "@ionic/react";
import { useLocation } from "react-router"
import { ProfileApplicationManager } from "../components/ProfileApplicationManager";

export const ProfileApplicationPage = () => {
    const queryParams = new URLSearchParams(useLocation().search);
    const userId = (queryParams.get("ui"));

    return (
        <IonContent>
            <ProfileApplicationManager userId={userId as string} />
        </IonContent>
    )
}