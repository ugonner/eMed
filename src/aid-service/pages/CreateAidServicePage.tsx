import { IonContent } from "@ionic/react"
import { AidServiceManager } from "../components/AidServiceManager"
import { NavigationBarGap } from "../../shared/components/partials/NavigationBarGap"

export const CreateAidServicePage = () => {
    return (
        <IonContent>
            <AidServiceManager />
            <NavigationBarGap />
        </IonContent>
    )
}