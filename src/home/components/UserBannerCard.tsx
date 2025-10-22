import {
  IonAvatar,
  IonCol,
  IonItem,
  IonLabel,
  IonRow,
  useIonRouter,
} from "@ionic/react";
import { IProfile } from "../../user/interfaces/user";
import { defaultUserImageUrl } from "../../shared/DATASETS/defaults";
import { UserRoutes } from "../../user/enums/routes.enum";
import { IBooking } from "../../Booking/interfaces/booking";

export interface IUserBannerCardProps {
  user: IProfile;
  lastRunningBooking?: IBooking;
}

export const UserBannerCard = ({
  user,
  lastRunningBooking,
}: IUserBannerCardProps) => {
  const currentGreeting = (): string => {
    let greeting = "Good morning";
    const currentTime = new Date(Date.now());
    const hours = currentTime.getHours();
    if (hours >= 12 && hours < 16) greeting = "Good Afternoon";
    else if (hours > 16 && hours < 24) greeting = "Good Evening";
    return greeting;
  };

  return (
    <IonRow color="primary">
      <IonCol size="12">
        <IonItem>
          <IonLabel>
            <h2>
              Hi {currentGreeting()}, {user.firstName}
            </h2>
            {lastRunningBooking ? (
              <p>
                {" "}
                You have a running appointment, with starting date,{" "}
                {new Date(
                  lastRunningBooking?.startDate as string
                ).getDate()}{" "}
              </p>
            ) : (
              <p>You do not have a running appointment</p>
            )}
          </IonLabel>
        </IonItem>
      </IonCol>
    </IonRow>
  );
};
