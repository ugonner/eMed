import { IonContent, IonGrid, IonPage } from "@ionic/react"
import { BaseHeader } from "../../shared/components/partials/BaseHeader"
import { VerifyPaymentPage } from "./VerifyPaymentPage"

export const VerifyPaymentCallbackPage = () => {
    return (
        <IonPage>
            <BaseHeader title="Transaction Payment" />
            <VerifyPaymentPage />
                
        </IonPage>
    )
}