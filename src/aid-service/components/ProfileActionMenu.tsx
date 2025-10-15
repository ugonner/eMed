import { useEffect, useRef, useState } from "react";
import { useAuthGuardContextStore } from "../../auth/contexts/AuthGuardContext";
import { IonContent, IonIcon, IonModal, IonPopover, useIonRouter } from "@ionic/react";
import { ellipsisVerticalSharp } from "ionicons/icons";
import { getLocalUser } from "../../utils";
import { BookingRoutes } from "../../Booking/enums/routes";
import { APIBaseURL, postData } from "../../shared/api/base";
import { AidServiceProfileActions } from "../enums/aid-service-profile";
import { AidServiceRoutes } from "../enums/routes";
import { IAidServiceProfile } from "../interfaces/aid-service-profile";
import { ProfileApplicationManager } from "./ProfileApplicationManager";
import { VerificationManager } from "./VerificationManager";

export interface IAidServiceProfileActionMenuProps {
    aidServiceProfile: IAidServiceProfile;
}

export const ProfileActionsMenu = ({aidServiceProfile}: IAidServiceProfileActionMenuProps) => {
    const {isAdmin} = useAuthGuardContextStore();

    const actionsRef = useRef<AidServiceProfileActions[]>([]);
     const [openEditAidServiceProfileOverlay, setOpenEditAidServiceProfileOverlay] = useState(false);
    const [openActionsMenuOverlay, setOpenActionsMenuOverlay] = useState(false);

    const router = useIonRouter();


    const takeAction = (action: AidServiceProfileActions) => {
        if(action === AidServiceProfileActions.BOOK) router.push(`${BookingRoutes.BOOK_SERVICE}?aspi=${aidServiceProfile.id}&asi=${aidServiceProfile?.aidService?.id}`);
        else if(action === AidServiceProfileActions.MANAGE) setOpenEditAidServiceProfileOverlay(true);
        else if(action === AidServiceProfileActions.DELETE) {
            postData(`${APIBaseURL}/aid-service`, {
                method: "delete",
                aidServiceProfileId: aidServiceProfile.id
            })
            .catch((err) => console.log( "Error deleting aid service",(err.message)))
        }
        setOpenActionsMenuOverlay(false);
    };

    useEffect(() => {
        const user = getLocalUser();
        
        if(isAdmin) actionsRef.current = Object.values(AidServiceProfileActions);
        else if(user?.userId === aidServiceProfile.profile?.userId) {
            actionsRef.current = [AidServiceProfileActions.MANAGE, AidServiceProfileActions.DELETE];
        }
        else if(user?.userId !== aidServiceProfile.profile?.userId) {
            actionsRef.current = [AidServiceProfileActions.BOOK, AidServiceProfileActions.REVIEW]
        }
    }, [aidServiceProfile]);



    return (
        <>
            <span
            role="button"
            aria-label="toggle menu"
            id={`aid-service-action-toggler${aidServiceProfile.id}`}
            onClick={() => setOpenActionsMenuOverlay(!openActionsMenuOverlay)}
            >
                <IonIcon icon={ellipsisVerticalSharp}></IonIcon>
            </span>
            <IonPopover
           trigger={`aid-service-action-toggler${aidServiceProfile.id}`}
            isOpen={openActionsMenuOverlay}
            onDidDismiss={() => setOpenActionsMenuOverlay(false)}
            >
                <VerificationManager aidServiceProfile={aidServiceProfile} />
                {
                    actionsRef.current.map((action, index) => (
                        <div key={index}
                        role="button"
                        aria-label={action}
                        onClick={() => {
                            takeAction(action);
                        }}
                        >
                            {action}
                        </div>
                    ))
                }
            </IonPopover>
            <IonModal
            isOpen={openEditAidServiceProfileOverlay}
            onDidDismiss={() => setOpenEditAidServiceProfileOverlay(false)}
            >
                <IonContent>
                    
                <ProfileApplicationManager aidServiceProfile={aidServiceProfile} onCompletion={() => setOpenEditAidServiceProfileOverlay(false)} />
                </IonContent>
            </IonModal>

        </>
    );

}