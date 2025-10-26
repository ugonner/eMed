import {
  IonAvatar,
  IonCol,
  IonGrid,
  IonIcon,
  IonImg,
  IonItem,
  IonLabel,
  IonRow,
  useIonRouter,
} from "@ionic/react";
import { IAidServiceProfile } from "../interfaces/aid-service-profile";
import { formatCamelCaseToSentence } from "../../shared/helpers";
import { AidServiceRoutes } from "../enums/routes";
import { ProfileActionsMenu } from "./ProfileActionMenu";
import { compassSharp } from "ionicons/icons";

export const defaultAidServiceProfileImageUrl = "/favicon.png";

export interface IAidServiceProfileCardProps {
  aidServiceProfile: IAidServiceProfile;
  showMenu?: boolean;
}

export const AidServiceProfileCard = ({
  aidServiceProfile,
  showMenu,
}: IAidServiceProfileCardProps) => {
  const router = useIonRouter();
  const { id: aidServiceProfileId, profile } = aidServiceProfile;

  return (
    <div>
      <IonGrid>
        <IonRow>
          <IonCol size={showMenu ? "11" : "12"}>
            <IonItem>
              <IonAvatar className="ion-margin">
                <IonImg
                  src={profile.avatar || defaultAidServiceProfileImageUrl}
                  alt="aid service profile"
                />
              </IonAvatar>
              <IonLabel>
                <h2
                  role="button"
                  aria-label={`view profile`}
                  onClick={() =>
                    router.push(
                      `${AidServiceRoutes.AID_SERVICE_PROFILE}?aspi=${aidServiceProfile?.id}`
                    )
                  }
                >
                  {profile?.firstName}, {profile?.lastName || ""}
                </h2>

                <p>
                  <small>
                    <IonIcon icon={compassSharp}></IonIcon>
                    <span className="ion-margin-horizontal">
                      {aidServiceProfile.locationAddress?.locality} &nbsp; 
                      {aidServiceProfile.locationAddress?.state}, &nbsp;
                      {aidServiceProfile.locationAddress?.country} 
                    </span>
                  </small>
                </p>
              </IonLabel>
            </IonItem>
          </IonCol>
          {showMenu && (
            <IonCol size="1">
              <ProfileActionsMenu aidServiceProfile={aidServiceProfile} />
            </IonCol>
          )}
        </IonRow>
      </IonGrid>
    </div>
  );
};
