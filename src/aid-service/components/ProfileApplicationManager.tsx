import { RefObject, useRef, useState } from "react";
import { usePresentToast } from "../../utils";
import { IFileAndObjectUrl } from "../../file/components/MultipleFiles";
import {
  AidServiceProfileDTO,
  ILocationAddress
} from "../dtos/aid-service-profile.dto";
import {
  IonButton,
  IonCol,
  IonGrid,
  IonIcon,
  IonInput,
  IonItem,
  IonRow,
  IonTextarea,
  useIonRouter,
} from "@ionic/react";
import {
  arrowBackSharp,
  arrowForwardSharp,
  briefcase,
  saveSharp,
} from "ionicons/icons";
import { SingleFile } from "../../file/components/SingleFile";
import { LocationAddressManager } from "../../Booking/components/LocationAddress";
import { SocialMediaLinksManager } from "./SocialMediaLinks";
import { uploadFiles } from "../../file/utils/filehooks";
import { APIBaseURL, postData } from "../../shared/api/base";
import { useLocation } from "react-router";
import { useAsyncHelpersContext } from "../../shared/contexts/async-helpers";
import { IAidServiceProfile } from "../interfaces/aid-service-profile";
import { VerificationManager } from "./VerificationManager";
import { AidServiceRoutes } from "../enums/routes";

export interface IAplyAidServiceProfileProps {
  aidServiceProfile?: IAidServiceProfile;
  userId: string;
  onCompletion?: () => void;
}

export const ProfileApplicationManager = ({
  aidServiceProfile,
  userId,
  onCompletion,
}: IAplyAidServiceProfileProps) => {
  const { setLoading, handleAsyncError } = useAsyncHelpersContext();
  const queryParams = new URLSearchParams(useLocation().search);
  
  const router = useIonRouter();

 
  const [pageNumber, setPageNumber] = useState(1);
  const [locationAddress, setLocationAddress] = useState<ILocationAddress>(
    (aidServiceProfile?.locationAddress || {}) as ILocationAddress
  );

  const inputFields: string[] = ["contactPhoneNumber"];

  const [aidServiceProfileDto, setAidServiceProfileDto] =
    useState<AidServiceProfileDTO | null>(
      (aidServiceProfile || {}) as AidServiceProfileDTO
    );

  const saveAidServiceProfile = async () => {
    try {
      if (
        locationAddress &&
        (!locationAddress?.street || !locationAddress?.city)
      ) {
        throw new Error("Location street and city are require");
      }
      const dto: AidServiceProfileDTO = {
        ...(aidServiceProfileDto || {}),
        locationAddress,
      };
      setLoading({ isLoading: true, loadingMessage: "saving profile" });
      const res = await postData<IAidServiceProfile>(`${APIBaseURL}/aid-service/profile/application?ui=${userId}`, {
        method: "post",
        ...dto,
      });

      setLoading({ isLoading: false, loadingMessage: "" });
      setAidServiceProfileDto({ ...(aidServiceProfileDto || {}), ...dto });
      if (onCompletion) onCompletion();
      else router.push(`${AidServiceRoutes.AID_SERVICE_PROFILE}?aspi=${res.id}`)
    } catch (error) {
      setLoading({ isLoading: false, loadingMessage: "" });
      handleAsyncError(error, "Error saving profile application");
    }
  };

  return (
    <div>
      <div style={{ height: "550px", overflow: "auto" }}>
        <IonGrid>
          <IonRow>
            {[
              "Contact Information"
            ].map((item, index) => (
              <IonCol key={index} size="6">
                <div
                  className="ion-text-center"
                  onClick={() => setPageNumber(index + 1)}
                  role="buton"
                  style={{
                    background: pageNumber === index + 1 ? "red" : "inherit",
                  }}
                >
                  <h2>{item}</h2>
                </div>
              </IonCol>
            ))}
          </IonRow>
        </IonGrid>

        <IonGrid>
          {pageNumber === 1 && (
            <>
              <IonRow>
                <IonCol size="12" sizeSm="3"></IonCol>
                <IonCol size="12" sizeSm="6">
                  
                  <div>
                    {inputFields.map((inputField, index) => (
                      <IonCol size="12" key={index}>
                        <IonItem detailIcon={briefcase}>
                          <IonInput
                            name={inputField}
                            label={`Enter ${inputField}`}
                            labelPlacement="floating"
                            type={
                              /PhoneNumber/i.test(inputField) ? "tel" : "text"
                            }
                            value={(aidServiceProfileDto as any)[inputField]}
                            onInput={(evt) => {
                              const { value } = evt.currentTarget;
                              setAidServiceProfileDto({
                                ...(aidServiceProfileDto || {}),
                                [inputField]: value,
                              } as AidServiceProfileDTO);
                            }}
                          />
                        </IonItem>
                      </IonCol>
                    ))}
                  </div>
                </IonCol>
                 <IonCol size="12">
                <LocationAddressManager
                  locationAddress={locationAddress}
                  setLocationAddress={setLocationAddress}
                />
              </IonCol>
              </IonRow>
            </>
          )}
          <IonRow>
            <IonCol size="12">
              <IonButton
              expand="full"
              onClick={() => saveAidServiceProfile()}
              >
                Save
              </IonButton>
            </IonCol>
          </IonRow>

         
        </IonGrid>
      </div>

    </div>
  );
};
