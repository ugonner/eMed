import {
  IonAvatar,
  IonCol,
  IonIcon,
  IonImg,
  IonItem,
  IonLabel,
  IonRow,
  useIonRouter,
} from "@ionic/react";
import { IProfile } from "../../user/interfaces/user";
import { defaultUserImageUrl } from "../../shared/DATASETS/defaults";
import { usePlainRTCContextStore } from "../../call/contexts/plainwebrtc";
import { arrowForwardSharp, refreshCircleOutline } from "ionicons/icons";
import { CallRoutes } from "../../call/enums/routes";
import { UserRoutes } from "../../user/enums/routes.enum";

export interface IUserBannerCardProps {
  user: IProfile;
}

export const UserBannerCard = ({ user }: IUserBannerCardProps) => {
  const { connectedUsersRecord, socketRef } = usePlainRTCContextStore();
  const router = useIonRouter();

  return (
    <IonRow color="primary">
      <IonCol size="12">
        <div style={{ display: "flex" }}>
          <div>
            <IonItem>
              <IonAvatar
                role={"button"}
                aria-label="open profile page"
                onClick={() =>
                  router.push(`${UserRoutes.PROFILE}?ui=${user.userId}`)
                }
              >
                <IonImg
                  src={user?.avatar || defaultUserImageUrl}
                  alt="your profile avatar"
                />
              </IonAvatar>
            </IonItem>
          </div>
          <IonLabel color={"primary"}>
            <h3>Welcome, {user.firstName}</h3>
            <p>What have you done for an Inclusive Society today?</p>
            <p>
              You can use an aid service to facilitate inclusivity in your
              programs.
            </p>
          </IonLabel>
        </div>
        <div
          style={{ display: "flex", justifyContent: "space-between" }}
          className="ion-margin-vertical"
        >
          <span
            style={{ borderLeft: "5px solid white" }}
            className="ion-padding-horizontal"
          >
            Live Users: {connectedUsersRecord.totalUsers}{" "}
            {(!socketRef.current?.connected) && (
              <IonIcon size="small" icon={refreshCircleOutline} />
            )}
          </span>
          <span
            style={{ borderLeft: "5px solid white" }}
            className="ion-padding-horizontal"
          >
            Live Providers {connectedUsersRecord.totalAidServiceProfiles} {" "}
            {(!socketRef.current?.connected) && (
              <IonIcon size="smalll" icon={refreshCircleOutline} />
            )}
          </span>
        </div>
      </IonCol>
    </IonRow>
  );
};
