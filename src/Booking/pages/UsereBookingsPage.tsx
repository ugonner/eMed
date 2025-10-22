import { IonContent } from "@ionic/react";
import { LocalStorageEnum } from "../../shared/enums";
import { IAuthUserProfile } from "../../user/interfaces/user";
import { useLocalStorage } from "../../utils"
import { ServiceBookings } from "../components/ServiceBookings";

export const UserBookingsPage = () => {
    const {getItem} = useLocalStorage();
    const authUser = getItem<IAuthUserProfile>(LocalStorageEnum.USER);

    return (
        <IonContent>
            <h2>My Appointments</h2>
            <div>
                <ServiceBookings queryPayload={{userId: authUser?.userId}} />
            </div>
        </IonContent>
    )
}