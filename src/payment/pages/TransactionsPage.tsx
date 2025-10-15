import { IonContent, IonPage } from "@ionic/react";
import { LocalStorageEnum } from "../../shared/enums";
import { IProfile } from "../../user/interfaces/user";
import { useLocalStorage } from "../../utils"
import { ServiceTransactions } from "../Components/ServiceTransactions";
import { BaseHeader } from "../../shared/components/partials/BaseHeader";

export const TransactionsPage = () => {
    const {getItem} = useLocalStorage();
    const user = getItem<IProfile>(LocalStorageEnum.USER);

    return (
        <IonPage>
            <BaseHeader title="Payment Transaction" />
            
        <IonContent id="base-menu-content">
            <ServiceTransactions queryPayload={{userId: user?.userId}} />
        </IonContent>
        </IonPage>
    )
}