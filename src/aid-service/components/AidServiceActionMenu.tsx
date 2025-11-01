import { useEffect, useRef, useState } from "react";
import { IAidService } from "../interfaces/aid-service.interface";
import { AidServiceActions } from "../enums/aid-service";
import { useAuthGuardContextStore } from "../../auth/contexts/AuthGuardContext";
import { IonIcon, IonModal, IonPopover, useIonRouter } from "@ionic/react";
import { ellipsisVerticalSharp } from "ionicons/icons";
import { AidServiceManager } from "./AidServiceManager";
import { BookingRoutes } from "../../Booking/enums/routes";
import { AidServiceRoutes } from "../enums/routes";
import { APIBaseURL, postData } from "../../shared/api/base";

export interface IAidServiceActionMenuProps {
    aidService: IAidService;
}

export const AidServiceActionMenu = ({aidService}: IAidServiceActionMenuProps) => {
    const {isAdmin} = useAuthGuardContextStore();

    const actionsRef = useRef<AidServiceActions[]>([]);
     const [openEditAidServiceOverlay, setOpenEditAidServiceOverlay] = useState(false);
    const [openActionsMenuOverlay, setOpenActionsMenuOverlay] = useState(false);

    const router = useIonRouter();


    const takeAction = (action: AidServiceActions) => {
        if(action === AidServiceActions.BOOK) router.push(`${BookingRoutes.BOOK_SERVICE}?asi=${aidService.id}`);
        else if(action === AidServiceActions.CREATE) router.push(AidServiceRoutes.AID_SERVICE_CREATE);
        else if(action === AidServiceActions.MANAGE) setOpenEditAidServiceOverlay(true);
        else if(action === AidServiceActions.DELETE) {
            postData(`${APIBaseURL}/aid-service/${aidService.id}`, {
                method: "delete"
            })
            .catch((err) => console.log( "Error deleting aid service",(err.message)))
        }
        setOpenActionsMenuOverlay(false);
    };

    useEffect(() => {
        if(isAdmin) actionsRef.current = Object.values(AidServiceActions);
        else actionsRef.current = [AidServiceActions.BOOK]
    }, []);



    return (
        <>
            <span
            role="button"
            aria-label="toggle menu"
            id={`aid-service-action-toggler${aidService.id}`}
            onClick={() => setOpenActionsMenuOverlay(!openActionsMenuOverlay)}
            >
                <IonIcon icon={ellipsisVerticalSharp}></IonIcon>
            </span>
            <IonPopover
           trigger={`aid-service-action-toggler${aidService.id}`}
            isOpen={openActionsMenuOverlay}
            onDidDismiss={() => setOpenActionsMenuOverlay(false)}
            >
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
            isOpen={openEditAidServiceOverlay}
            onDidDismiss={() => setOpenEditAidServiceOverlay(false)}
            >
                <AidServiceManager aidService={aidService} onCompletion={() => setOpenEditAidServiceOverlay(false)} />
            </IonModal>

        </>
    );

}