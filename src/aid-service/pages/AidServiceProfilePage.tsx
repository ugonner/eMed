import { useLocation } from "react-router";
import { formatCurrency, getLocalUser, usePresentToast } from "../../utils";
import { useAsyncHelpersContext } from "../../shared/contexts/async-helpers";
import { useEffect, useState } from "react";
import { IAidServiceProfile } from "../interfaces/aid-service-profile";
import { APIBaseURL, getData, postData } from "../../shared/api/base";
import {
  IonAvatar,
  IonButton,
  IonCol,
  IonGrid,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonModal,
  IonPopover,
  IonRow,
  IonSelect,
  IonSelectOption,
  IonTextarea,
} from "@ionic/react";
import { AidServiceProfileCard } from "../components/AidServiceProfileCard";
import { formatCamelCaseToSentence } from "../../shared/helpers";
import {
  chatboxSharp,
  closeCircleSharp,
  ellipsisVertical,
} from "ionicons/icons";
import { useAuthGuardContextStore } from "../../auth/contexts/AuthGuardContext";
import { AidServiceRoutes } from "../enums/routes";
import { AidServiceProfileVerificationStatus } from "../../shared/enums/aid-service";
import { AidServiceProfileDTO } from "../dtos/aid-service-profile.dto";
import { ProfileApplicationManager } from "../components/ProfileApplicationManager";
import { ProfileActionsMenu } from "../components/ProfileActionMenu";
import { LocationAddressCard } from "../../Booking/components/LocationAddress";
import { SocialMediaLinksCard } from "../components/SocialMediaLinks";
import { ServiceBookings } from "../../Booking/components/ServiceBookings";

export interface IAidServiceProfilePageProps {}

export const AidServiceProfilePage = () => {
  const { setLoading, handleAsyncError } = useAsyncHelpersContext();
  const { isAdmin } = useAuthGuardContextStore();
  const queryParams = new URLSearchParams(useLocation().search);
  const aidServiceProfileId = queryParams.get("aspi");

  const [aidServiceProfile, setAidServiceProfile] =
    useState<IAidServiceProfile>();
  const [tabNumber, setTabNumber] = useState(1);

  const initAidServiceProfile = async () => {
    try {
      setLoading({ isLoading: true, loadingMessage: "loading" });
      const res = await getData<IAidServiceProfile>(
        `${APIBaseURL}/aid-service/profile/${aidServiceProfileId}`
      );
      setLoading({ isLoading: false, loadingMessage: "" });
      setAidServiceProfile(res);
    } catch (error) {
      handleAsyncError(error, "Error initializing aid service profile");
    }
  };
  const user = getLocalUser();
  const isOwner = user?.userId === aidServiceProfile?.profile?.userId;

  useEffect(() => {
    initAidServiceProfile();
  }, []);

  const costInfo: {
    earningValueField: string;
    countField: string;
  }[] = [
    {
      earningValueField: "audioCallEarnings",
      countField: "noOfAudioCallServices",
    },
    {
      earningValueField: "videoCallEarnings",
      countField: "noOfVideoCallServices",
    },
    {
      earningValueField: "onSiteEarnings",
      countField: "noOfOnSiteServices",
    },
    {
      earningValueField: "totalEarningsBalance",
      countField: "totalServicesRendered",
    },
  ];

  return (
    <div>
      <IonGrid>
        {aidServiceProfile && (
          <>
            <IonRow>
              <IonCol size="11">
                <AidServiceProfileCard aidServiceProfile={aidServiceProfile} />
              </IonCol>
              <IonCol size="1">
                <ProfileActionsMenu aidServiceProfile={aidServiceProfile} />
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol size="12" sizeSm="6">
                <LocationAddressCard
                  locationAddress={aidServiceProfile.locationAddress}
                />
              </IonCol>
              <IonCol size="12">
                <div>
                  <h4>About:</h4>
                  <p>{aidServiceProfile.profile?.firstName}</p>
                </div>
              </IonCol>
            </IonRow>

            {(isOwner || isAdmin) && (
              <>
                <IonRow>
                  {costInfo.map((item, index) => (
                    <IonCol key={index} size="12" sizeSm="3">
                      <div className="ion-text-center">
                        <div>
                          {formatCamelCaseToSentence(item.earningValueField)}
                        </div>
                        <div style={{ fontSize: "2em" }}>
                          {formatCurrency(
                            Number(
                              (aidServiceProfile as any)[item.earningValueField]
                            ),
                            "NGN"
                          )}
                        </div>
                        <div>
                          {(aidServiceProfile as any)[item.countField]} services
                        </div>
                      </div>
                    </IonCol>
                  ))}
                </IonRow>
                <IonRow>
                  <IonCol size="12" sizeSm="6">
                    <IonItem>
                      <IonAvatar>
                        <IonIcon icon={chatboxSharp} size="large"></IonIcon>
                      </IonAvatar>
                      <IonLabel className="ion-margin">
                        <h3>Verification Comment</h3>
                        <p>{aidServiceProfile.verificationComment}</p>
                      </IonLabel>
                    </IonItem>
                  </IonCol>
                </IonRow>
              </>
            )}
          </>
        )}

        {isOwner && (
          <IonRow>
            {["Bookings", "Calls"].map((item, index) => (
              <IonCol size="6" key={index}>
                <span
                  role="button"
                  aria-label={item}
                  onClick={() => setTabNumber(index + 1)}
                >
                  {item}
                </span>
              </IonCol>
            ))}
          </IonRow>
        )}
        
              <IonRow>
                <IonCol size="12">
                  {(isOwner && tabNumber === 1) && (
                    <ServiceBookings queryPayload={{ aidServiceProfileId }} />
                  )}
                  
                </IonCol>
              </IonRow>
      </IonGrid>
    </div>
  );
};
