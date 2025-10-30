import {
  IonAvatar,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCol,
  IonIcon,
  IonImg,
  IonItem,
  IonLabel,
  IonRow,
  IonSpinner,
  useIonRouter,
} from "@ionic/react";
import { useIInitContextStore } from "../../shared/contexts/InitContextProvider";
import { defaultAidServiceImageUrl } from "../../aid-service/components/AidServiceCard";
import { AidServiceRoutes } from "../../aid-service/enums/routes";
import { arrowForwardCircle, medkitSharp } from "ionicons/icons";
import { BookingRoutes } from "../../Booking/enums/routes";

export const QuickActions = () => {
  const { aidServicesRef } = useIInitContextStore();
  const router = useIonRouter();
  return (
    <>
      <IonRow>
        <IonCol size="12">
          <IonItem>
            <IonLabel>
              <h3>
                Services 
                {
                  aidServicesRef.current.length === 0 && (
                    <IonSpinner />
                  )
                }
              </h3>
            </IonLabel>
          </IonItem>
        </IonCol>
      </IonRow>
      <IonRow>
        <IonCol size="12">
          <div>
            {aidServicesRef.current.map((aidService, index) => (
              <IonItem key={index}>
                <IonAvatar color="primary">
                  <IonIcon size="large" icon={medkitSharp} />
                </IonAvatar>
                <IonLabel className="ion-margin-horizontal">
                  <h2
                    role="link"
                    onClick={() =>
                      router.push(
                        `${AidServiceRoutes.AID_SERVICE_SINGLE}?ASI=${aidService.id}`
                      )
                    }
                  >
                    {aidService.name}
                  </h2>
                  <p>{aidService.description?.substring(0, 140)}</p>
                  <IonButton
                    expand="full"
                    fill="clear"
                    size="small"
                    routerLink={`${BookingRoutes.BOOK_SERVICE}?asi=${aidService.id}`}
                  >
                    Request Service{" "}
                    <IonIcon
                      className="ion-margin-horizontal"
                      icon={arrowForwardCircle}
                    ></IonIcon>
                  </IonButton>
                </IonLabel>
              </IonItem>
            ))}
          </div>
        </IonCol>
      </IonRow>
    </>
  );
};
