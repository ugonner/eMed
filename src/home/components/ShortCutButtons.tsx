import { calendar, medkit, personCircle } from "ionicons/icons";
import { BookingRoutes } from "../../Booking/enums/routes";
import { IonCard, IonCol, IonIcon, IonRow, useIonRouter } from "@ionic/react";
import { useLocalStorage } from "../../utils";
import { IAuthUserProfile, IProfile } from "../../user/interfaces/user";
import { LocalStorageEnum } from "../../shared/enums";
import { UserRoutes } from "../../user/enums/routes.enum";
import { AidServiceRoutes } from "../../aid-service/enums/routes";

export const ShortCutButtons = ({user}: {user?: IProfile}) => {
    const router = useIonRouter();

    
    const shortCutItems: {
        icon: string;
        label: string;
        routeLink: string;
    }[] = [
        {
            label: "bookings",
            icon: calendar,
            routeLink: `${BookingRoutes.USER_BOOKINGS}?ui=${user?.userId}`
        },
        {
            label: "Services",
            icon: medkit,
            routeLink: `${AidServiceRoutes.AID_SERVICE_ALL}`
        },
        {
            label: "Profile",
            icon: personCircle,
            routeLink: `${UserRoutes.PROFILE}`,
        }

    ];

    return (
        <>
            <IonRow>
                {
                    shortCutItems.map((item, index) => (
                        <IonCol size="4" key={index}>
                            <IonCard>
                                <div 
                                onClick={() => router.push(item.routeLink)}
                                className="ion-text-center">
                                <IonIcon icon={item.icon} size="large"></IonIcon>
                                <br/>
                                <small>{item.label}</small>
                            </div>
                            </IonCard>
                        </IonCol>
                    ))
                }
            </IonRow>
        </>
    )
}