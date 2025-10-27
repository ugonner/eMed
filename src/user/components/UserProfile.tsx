import { useEffect, useRef, useState } from "react";
import { IProfile } from "../interfaces/user";
import { IonButton, IonCol, IonLabel, IonRow } from "@ionic/react";
import { UserCard } from "./UserCard";
import { UserMenu } from "./UserMenu";
import { getLocalUser } from "../../utils";

import { ServiceProfiles } from "../../aid-service/components/ServiceProfiles";
import { ServiceBookings } from "../../Booking/components/ServiceBookings";
import { UserProfileWalletCard } from "./wallet/UserWalletCard";
import { IProfileWallet } from "../interfaces/user-wallet";

export interface IUserProfileProps {
  profile: IProfile;
  profileWallet?: IProfileWallet;
  userId: string;
}

export const UserProfile = ({
  profile,
  profileWallet,
  userId,
}: IUserProfileProps) => {
  const user = getLocalUser();
  const isOwner = profile?.userId === user?.userId;

  const profileRef = useRef<IProfile>(profile);
  const profileWalletRef = useRef<IProfileWallet | undefined>(profileWallet);

  const [tabNumber, setTabNumber] = useState(1);

  let tabs: { tabNumber: number; label: string }[] = [];
  if (isOwner) {
    tabs = [
      { tabNumber: 1, label: "Bookings" },
    ];
  }

  useEffect(() => {
    profileRef.current = profile;

    profileWalletRef.current = profileWallet;
  }, [profile, profileWallet]);

  return (
    <>
      <IonRow>
        <IonCol size="11">
          <UserCard 
          user={profileRef.current}
          userRole={profileRef.current?.account?.role}
          />
        </IonCol>
        <IonCol size="1">
          <UserMenu user={profileRef.current} />
        </IonCol>
      </IonRow>
      {profileWalletRef.current && (
        <IonRow>
          <IonCol size="12">
            <UserProfileWalletCard userWallat={profileWalletRef.current} />
          </IonCol>
        </IonRow>
      )}
      <IonRow>
        {tabs.map((item, index) => (
          <IonCol key={index} size={"4"}>
            <small role="button" onClick={() => setTabNumber(item.tabNumber)}>
              {item.label}
            </small>
          </IonCol>
        ))}
      </IonRow>
      <IonRow>
        <IonCol size="12">
          {tabNumber === 1 && <ServiceProfiles queryPayload={{ userId }} />}
          {tabNumber === 2 && (
            <ServiceBookings
              queryPayload={{ userId: profileRef.current.userId }}
            />
          )}
         
        </IonCol>
      </IonRow>
    </>
  );
};
