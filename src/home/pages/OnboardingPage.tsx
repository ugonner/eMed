import { IonContent, IonPage } from "@ionic/react"
import { OnBoarding } from "../components/launch-screens/Onboarding"
import { NavigationBarGap } from "../../shared/components/partials/NavigationBarGap"

export const OnboardingPage = () => {
    return (
        <IonPage>
            
        <IonContent>
            <OnBoarding />
            <NavigationBarGap />
        </IonContent>
        </IonPage>
    )
}