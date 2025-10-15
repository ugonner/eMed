import { useRef, useState } from "react";
import {
  IonCol,
  IonContent,
  IonGrid,
  IonIcon,
  IonItem,
  IonLabel,
  IonModal,
  IonRow,
  IonSearchbar,
  IonToolbar,
} from "@ionic/react";
import { AidServiceProfileCard } from "../../aid-service/components/AidServiceProfileCard";
import { APIBaseURL, getData, postData } from "../../shared/api/base";
import { IQueryResult } from "../../shared/interfaces/api-response";
import { useAsyncHelpersContext } from "../../shared/contexts/async-helpers";
import { addSharp, checkmarkDoneSharp, closeCircle } from "ionicons/icons";
import { Pagination } from "../../shared/components/general/Pagination";
import { IAidServiceProfile } from "../../aid-service/interfaces/aid-service-profile";
import { BookingDTO } from "../dtos/booking.dto";

export interface IAidServiceProfileSelectorProps {
  aidServiceProfile: IAidServiceProfile;
  bookingDto: BookingDTO;
  onSelection: (aidServiceProfile: IAidServiceProfile) => void;
}

export const AidServiceProfileSelector = ({
  aidServiceProfile,
  bookingDto,
  onSelection,
}: IAidServiceProfileSelectorProps) => {
  const { handleAsyncError } = useAsyncHelpersContext();

  const queryPayloadRef = useRef<{ [key: string]: unknown }>({});
  const [selectedAidServiceProfile, setSelectedAidServiceProfile] =
    useState<IAidServiceProfile>(aidServiceProfile);
  const [aidServiceProfilesResult, setAidServiceProfilesResult] = useState<
    IQueryResult<IAidServiceProfile>
  >({} as IQueryResult<IAidServiceProfile>);
  const [openAidServiceProfilesOverlay, setOpenAidServiceProfilesOverlay] =
    useState(false);

  const [isLoading, setIsLoading] = useState(false);

  return (
    <div>
      <div>
        <IonToolbar>
          <AidServiceProfileCard
            aidServiceProfile={selectedAidServiceProfile}
          />
          <IonIcon
            role="button"
            aria-label="open view to change the service"
            onClick={() =>
              setOpenAidServiceProfilesOverlay(!openAidServiceProfilesOverlay)
            }
            slot="end"
            icon={addSharp}
          ></IonIcon>
        </IonToolbar>
        <IonModal
          isOpen={openAidServiceProfilesOverlay}
          onDidDismiss={() => setOpenAidServiceProfilesOverlay(false)}
        >
          <IonItem>
            <IonIcon
              role="button"
              slot="end"
              className="ion-margin"
              size="large"
              aria-label="close"
              onClick={() => setOpenAidServiceProfilesOverlay(false)}
              icon={closeCircle}
            ></IonIcon>
          </IonItem>
          <IonContent>
            <IonGrid>
              <IonRow>
                <IonCol size="12">
                  <IonLabel>
                    <h3>Search for Aid Services </h3>
                    <p>
                      You can search for alternative aid service providers, search by
                      anything from provider's email, personal names, business name to disability types: visual,
                      hearing etc
                    </p>
                  </IonLabel>
                  <IonSearchbar
                    type="text"
                    onIonInput={(evt) => {
                      queryPayloadRef.current = {
                        searchTerm: evt.detail.value,
                      };
                      getData<IQueryResult<IAidServiceProfile>>(
                        `${APIBaseURL}/aid-service/profile`,
                        queryPayloadRef.current
                      )
                        .then((res) => {
                          setAidServiceProfilesResult({ ...res });
                          setOpenAidServiceProfilesOverlay(true);
                        })
                        .catch((err) => {
                          handleAsyncError(err, "Error searching aid services");
                        });
                    }}
                    debounce={300}
                  />
                </IonCol>
              </IonRow>
              {openAidServiceProfilesOverlay && (
                <>
                  {aidServiceProfilesResult.data?.length > 0 &&
                    aidServiceProfilesResult.data?.map((aProfile) => (
                      <IonRow key={aProfile.id}>
                        <IonCol size="10">
                          <AidServiceProfileCard aidServiceProfile={aProfile} />
                        </IonCol>
                        <IonCol size="2">
                          <span
                            role="button"
                            className="ion-margin"
                            aria-label={`select ${aProfile.name}`}
                            onClick={async () => {
                              try {
                                setIsLoading(true);
                                const isEligible = await postData<boolean>(
                                  `${APIBaseURL}/booking/profile/validate`,
                                  {
                                    method: "post",
                                    aidServiceProfileId: aProfile.id,
                                    ...bookingDto,
                                  }
                                );
                                if (isEligible) {
                                  setSelectedAidServiceProfile(aProfile);
                                  setOpenAidServiceProfilesOverlay(false);
                                  onSelection(aProfile);
                                }

                                setIsLoading(false);
                              } catch (error) {
                                setIsLoading(false);
                                handleAsyncError(
                                  error,
                                  "Error setting aid service profile"
                                );
                              }
                            }}
                          >
                            <IonIcon
                              icon={checkmarkDoneSharp}
                              size="large"
                            ></IonIcon>
                          </span>
                        </IonCol>
                      </IonRow>
                    ))}
                  <IonRow>
                    <IonCol size="12">
                      {aidServiceProfilesResult.data?.length > 0 ? (
                        <Pagination
                          setQueryResult={setAidServiceProfilesResult}
                          queryBaseUrl={`${APIBaseURL}/aid-service/profile`}
                          queryPayloadRef={queryPayloadRef}
                          totalItems={aidServiceProfilesResult.total || 0}
                          limit={50}
                        />
                      ) : (
                        <h4 className="ion-text-center">
                          No Providers, search to find
                        </h4>
                      )}
                    </IonCol>
                  </IonRow>
                </>
              )}
            </IonGrid>
          </IonContent>
        </IonModal>
      </div>
    </div>
  );
};
