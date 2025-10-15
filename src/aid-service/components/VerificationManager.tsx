import { FormEvent, useState } from "react";
import { IAidServiceProfile } from "../interfaces/aid-service-profile";
import { useAsyncHelpersContext } from "../../shared/contexts/async-helpers";
import { useAuthGuardContextStore } from "../../auth/contexts/AuthGuardContext";
import { AidServiceProfileVerificationStatus } from "../../shared/enums/aid-service";
import { APIBaseURL, postData } from "../../shared/api/base";
import { IonButton, IonIcon, IonItem, IonModal, IonSelect, IonSelectOption, IonTextarea } from "@ionic/react";
import { closeCircle } from "ionicons/icons";

export interface IVerificationManagerProps {
  aidServiceProfile: IAidServiceProfile;
  onCompletion?: (profile?: IAidServiceProfile) => void;
}

export const VerificationManager = ({
  aidServiceProfile,
  onCompletion,
}: IVerificationManagerProps) => {
  const { setLoading, handleAsyncError } = useAsyncHelpersContext();
  const { isAdmin } = useAuthGuardContextStore();

  const [verificationDto, setVerificationDto] = useState<{
    verificationComment?: string;
    verificationStatus?: AidServiceProfileVerificationStatus;
  }>({
    verificationComment: aidServiceProfile?.verificationComment,
    verificationStatus: aidServiceProfile?.verificationStatus,
  });

  const [openVerificationOverlay, setOpenVerificationOverlay] = useState(false);

  const updateVerification = async () => {
    try {
      if(!aidServiceProfile?.id) throw new Error("Aid service profile has no identify");
      setLoading({ isLoading: true, loadingMessage: "loading" });
      const res = await postData<IAidServiceProfile>(
        `${APIBaseURL}/aid-service/application/status/${aidServiceProfile?.id}`,
        {
          method: "put",
          ...(verificationDto || {}),
        }
      );
      setLoading({ isLoading: false, loadingMessage: "" });
      setVerificationDto({
        verificationComment: res.verificationComment,
        verificationStatus: res.verificationStatus,
      });
      if (onCompletion) onCompletion(aidServiceProfile);
    } catch (error) {
      handleAsyncError(
        error,
        "Error Updating verification status for  aid service profile"
      );
    }
  };

  return (
    <div>
      {isAdmin ? (
        <IonButton
          fill="clear"
          aria-expanded={openVerificationOverlay}
          aria-haspopup={true}
          onClick={() => setOpenVerificationOverlay(!openVerificationOverlay)}
        >
          Update verification
        </IonButton>
      ) : (
        <span>Verification: {aidServiceProfile.verificationStatus}</span>
      )}
      <IonModal
      isOpen={openVerificationOverlay}
      onDidDismiss={() => setOpenVerificationOverlay(false)}
      >
        <IonItem>
            <h2>Update Verification status</h2>
            <IonIcon
            role="button"
            onClick={() => setOpenVerificationOverlay(false)}
            aria-label="close"
            slot="end"
            icon={closeCircle}
            className="ion-padding"
            ></IonIcon>
        </IonItem>
        <div style={{overflow: "auto"}}>
             <div>
                    <h3>Update Verification</h3>
                    <IonItem>
                      <IonSelect
                        value={verificationDto.verificationStatus}
                        onIonChange={(evt) => {
                          setVerificationDto({
                            ...verificationDto,
                            verificationStatus: evt.target.dataset
                              .value as AidServiceProfileVerificationStatus,
                          });
                        }}
                      >
                        {Object.values(AidServiceProfileVerificationStatus).map(
                          (item) => (
                            <IonSelectOption key={item} value={item}>
                              {item}
                            </IonSelectOption>
                          )
                        )}
                      </IonSelect>
                    </IonItem>
                    <IonTextarea
                      label="Verification comments, drop notes on reasons for action"
                      labelPlacement="floating"
                      value={verificationDto.verificationComment}
                      onIonInput={(evt) => {
                        setVerificationDto({
                          ...verificationDto,
                          verificationComment: evt.detail.value as string,
                        });
                      }}
                    />
                    <IonButton expand="full" onClick={updateVerification}>
                      Update
                    </IonButton>
                  </div>
        </div>
      </IonModal>
    </div>
  );
};
