import {
  IonAvatar,
  IonCol,
  IonGrid,
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

export const defaultAidServiceProfileImageUrl = "";

export interface IAidServiceProfileCardProps {
  aidServiceProfile: IAidServiceProfile;
  showMenu?: boolean;
}

export const AidServiceProfileCard = ({
  aidServiceProfile,
  showMenu
}: IAidServiceProfileCardProps) => {
  const router = useIonRouter();
  const {
    id: aidServiceProfileId,
    name,
    verificationStatus,
    profile,
    aidService,
    mediaFile,

    noOfAudioCallServices,
    noOfVideoCallServices,
    noOfOnSiteServices,
    totalEarningsBalance,
  } = aidServiceProfile;

  const profileStats = {
    noOfAudioCallServices,
    noOfVideoCallServices,
    noOfOnSiteServices,
    totalEarningsBalance,
  };

  return (
    <div>
      <IonGrid>
        <IonRow>
          <IonCol size={showMenu ? "11" : "12"}>
            <IonItem>
              <IonAvatar className="ion-margin">
                <IonImg
                  src={mediaFile || defaultAidServiceProfileImageUrl}
                  alt="aid service profile"
                />
              </IonAvatar>
              <IonLabel>
                <h2
                role="button"
                aria-label={`view ${name}`}
                onClick={() => router.push(`${AidServiceRoutes.AID_SERVICE_PROFILE}?aspi=${aidServiceProfile?.id}`)}

                >
                  {name} | {aidService?.name}
                </h2>
                <p>Verification status: {verificationStatus || "NA"} </p>
                <p>
                  <small>Provided by: {profile?.firstName} {profile?.lastName} </small>
                </p>
                <p> 
                  {Object.keys(profileStats).map((field) => (
                    <span className="ion-margin-horizontal" key={field}>
                      {formatCamelCaseToSentence(field)}
                      <span style={{ fontWeight: "bold" }}>
                        {(profileStats as any)[field]}
                      </span>
                    </span>
                  ))}
                </p>
              </IonLabel>
            </IonItem>
          </IonCol>
          {
            showMenu && (
              <IonCol size="1">
                <ProfileActionsMenu aidServiceProfile={aidServiceProfile} />
              </IonCol>
            )
          }
        </IonRow>
      </IonGrid>
    </div>
  );
};
