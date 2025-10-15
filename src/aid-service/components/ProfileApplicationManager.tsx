import { RefObject, useRef, useState } from "react";
import { usePresentToast } from "../../utils";
import { IFileAndObjectUrl } from "../../file/components/MultipleFiles";
import {
  AidServiceProfileDTO,
  ILocationAddress,
  ISocialMediaLinks,
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
import { LocationAddressManager } from "./LocationAddress";
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
  aidServiceIdNumber?: number;
  onCompletion?: () => void;
}

export const ProfileApplicationManager = ({
  aidServiceProfile,
  aidServiceIdNumber,
  onCompletion,
}: IAplyAidServiceProfileProps) => {
  const { setLoading, handleAsyncError } = useAsyncHelpersContext();
  const queryParams = new URLSearchParams(useLocation().search);
  
  const router = useIonRouter();

  const aidServiceId: number =
    Number(queryParams.get("asi")) || Number(aidServiceIdNumber) || Number(aidServiceProfile?.aidService?.id);
  const businessDocumentfileInputRef = useRef<HTMLInputElement>();
  const mediaFileInputRef = useRef<HTMLInputElement>();
  const [selectedBusinessDocumentFile, setSelectedBusinessDocumentFile] =
    useState<IFileAndObjectUrl | null>(null);
  const [selectedMediaFile, setSelectedMediaFile] =
    useState<IFileAndObjectUrl | null>(null);

  const [pageNumber, setPageNumber] = useState(1);
  const [locationAddress, setLocationAddress] = useState<ILocationAddress>(
    (aidServiceProfile?.locationAddress || {}) as ILocationAddress
  );
  const [socialMediaLinks, setSocialMediaLinks] = useState<ISocialMediaLinks>(
    (aidServiceProfile?.socialMediaLinks || {}) as ISocialMediaLinks
  );

  const inputFields: string[] = ["contactPhoneNumber"];

  const [aidServiceProfileDto, setAidServiceProfileDto] =
    useState<AidServiceProfileDTO | null>(
      (aidServiceProfile || {}) as AidServiceProfileDTO
    );

  const saveAidServiceProfile = async () => {
    try {
      if (!aidServiceId) throw new Error("No aid service is selecte");
      if (!aidServiceProfileDto?.description?.trim().length) {
        setPageNumber(1);
        throw new Error("Description is required");
      }
      if (
        locationAddress &&
        (!locationAddress?.street || !locationAddress?.city)
      ) {
        setPageNumber(2);
        throw new Error("Location street and city are require");
      }
      const dto: AidServiceProfileDTO = {
        ...(aidServiceProfileDto || {}),
        aidServiceId,
        locationAddress,
        socialMediaLinks,
      };
      setLoading({ isLoading: true, loadingMessage: "saving profile" });
      let businessFileUrl = "";
      let mediaFileUrl = "";
      if (selectedBusinessDocumentFile) {
        const res = await uploadFiles([selectedBusinessDocumentFile]);
        if (res) businessFileUrl = res[0]?.attachmentUrl;
        dto.businessDocumentUrl = businessFileUrl;
      }
      if (selectedMediaFile) {
        const res = await uploadFiles([selectedMediaFile]);
        if (res) mediaFileUrl = res[0].attachmentUrl;
        dto.mediaFile = mediaFileUrl;
      }

      await postData(`${APIBaseURL}/aid-service/profile/application`, {
        method: "post",
        ...dto,
      });

      setLoading({ isLoading: false, loadingMessage: "" });
      setAidServiceProfileDto({ ...(aidServiceProfileDto || {}), ...dto });
      if (onCompletion) onCompletion();
      else router.push(`${AidServiceRoutes.AID_SERVICE_SINGLE}?asi=${aidServiceId}`)
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
              "Business Information",
              "Contact Information",
              "Business File Uploads",
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
            <IonCol size="6">
              <VerificationManager
                aidServiceProfile={
                  aidServiceProfile || ({} as IAidServiceProfile)
                }
              />
            </IonCol>
          </IonRow>
        </IonGrid>

        <IonGrid>
          {pageNumber === 1 && (
            <>
              <IonRow>
                <IonCol size="12" sizeSm="3"></IonCol>
                <IonCol size="12" sizeSm="6">
                  <IonItem>
                    <IonInput
                    type="text"
                    label="Your Business Name"
                    labelPlacement="floating"
                    placeholder="Ugonna Signs"
                    value={aidServiceProfileDto?.name}
                    onIonInput={(evt) => {
                      setAidServiceProfileDto({...aidServiceProfileDto, name: (evt.detail.value as string) } as AidServiceProfileDTO)
                    }}
                    />

                  </IonItem>
                  <IonTextarea
                    label="Describe your service briefly"
                    labelPlacement="floating"
                    onInput={(evt) => {
                      setAidServiceProfileDto({
                        ...(aidServiceProfileDto || {}),
                        description: evt.currentTarget.value,
                      } as AidServiceProfileDTO);
                    }}
                  />
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
                <IonCol size="12" sizeSm="3"></IonCol>
              </IonRow>
            </>
          )}

          {pageNumber === 2 && (
            <IonRow>
              <IonCol size="12">
                <LocationAddressManager
                  locationAddress={locationAddress}
                  setLocationAddress={setLocationAddress}
                />
              </IonCol>
              <IonCol size="12">
                <SocialMediaLinksManager
                  socialMediaLinks={socialMediaLinks}
                  setSocialMediaLinks={setSocialMediaLinks}
                />
              </IonCol>
            </IonRow>
          )}
          {pageNumber === 3 && (
            <IonRow>
              <IonCol size="12" sizeSm="6">
                <h3>Business Document</h3>
                <h6>
                  Upload business document like CAC registrations, improving
                  your verification process. This cannot be viewed by other
                  users
                </h6>
                <SingleFile
                  fileInputRef={
                    businessDocumentfileInputRef as RefObject<HTMLInputElement>
                  }
                  selectedSingleFile={selectedBusinessDocumentFile}
                  setSelectedSingleFile={setSelectedBusinessDocumentFile}
                  acceptedFileType="image"
                />
              </IonCol>
              <IonCol size="12" sizeSm="6">
                <h3>Service Profile Image</h3>
                <h6>
                  Upload nice image that helps portray your service profile to
                  other users, this can be viewed by other users on your profile
                </h6>
                <SingleFile
                  fileInputRef={
                    mediaFileInputRef as RefObject<HTMLInputElement>
                  }
                  selectedSingleFile={selectedMediaFile}
                  setSelectedSingleFile={setSelectedMediaFile}
                  acceptedFileType="image"
                />
              </IonCol>
            </IonRow>
          )}
        </IonGrid>
      </div>

      <IonGrid>
        <IonRow>
          <IonCol size="12">
            <IonItem>
              {[arrowBackSharp, arrowForwardSharp, saveSharp].map(
                (icon, index) => (
                  <IonButton
                    key={index}
                    fill="clear"
                    slot={icon === saveSharp ? "end" : "start"}
                    onClick={() => {
                      if (icon === arrowBackSharp && pageNumber > 1)
                        setPageNumber(pageNumber - 1);
                      if (icon === arrowForwardSharp && pageNumber < 3)
                        setPageNumber(pageNumber + 1);
                      if (icon === saveSharp) saveAidServiceProfile();
                    }}
                  >
                    <IonIcon icon={icon} size="large"></IonIcon>
                    <span>{icon === saveSharp ? "save" : ""}</span>
                  </IonButton>
                )
              )}
            </IonItem>
          </IonCol>
        </IonRow>
      </IonGrid>
    </div>
  );
};
