import { useLocation } from "react-router"
import { ILocationCord } from "../components/LocationVisualizer";
import { IonCol, IonContent, IonGrid, IonRow } from "@ionic/react";
import LocationTracker from "../components/LocationTracker";
import { NavigationBarGap } from "../../shared/components/partials/NavigationBarGap";

export const LocationTrackerPage = () => {
    const queryParams = new URLSearchParams(useLocation().search);

    const targetLocation: ILocationCord = {
        latitude: Number(queryParams.get("lat")),
        longitude: Number(queryParams.get("lon"))
    }

    return (
        <IonContent>
            <IonGrid>
                <IonRow>
                    <IonCol size="12" sizeSm="3"></IonCol>
                    <IonCol size="12" sizeSm="6">
                        <LocationTracker targetLocation={targetLocation} />
                    </IonCol>
                    <IonCol size="12" sizeSm="3"></IonCol>
                </IonRow>
            </IonGrid>
            <NavigationBarGap />
        </IonContent>
    )
}