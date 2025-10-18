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
import { UserRoutes } from "../../user/enums/routes.enum";

export interface IUserBannerCardProps {
  user: IProfile;
}

export const UserBannerCard = ({ user }: IUserBannerCardProps) => {
  const router = useIonRouter();

  return (
    <IonRow color="primary">
      <IonCol size="12">
        <h3>You are welcome</h3>
        </IonCol>
    </IonRow>
  );
};
