import { useRef, useState } from "react";
import { IAidService } from "../../aid-service/interfaces/aid-service.interface";
import {
  IonButton,
  IonCol,
  IonContent,
  IonGrid,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonModal,
  IonRow,
  IonSearchbar,
  IonToolbar,
} from "@ionic/react";
import { AidServiceCard } from "../../aid-service/components/AidServiceCard";
import { APIBaseURL, getData } from "../../shared/api/base";
import { IQueryResult } from "../../shared/interfaces/api-response";
import { useAsyncHelpersContext } from "../../shared/contexts/async-helpers";
import { addSharp, checkmarkDoneSharp, closeCircle } from "ionicons/icons";
import { Pagination } from "../../shared/components/general/Pagination";

export interface IAidServiceSelectorProps {
  aidService: IAidService;
  onSelection: (aidService: IAidService) => void;
}

export const AidServiceSelector = ({
  aidService,
  onSelection,
}: IAidServiceSelectorProps) => {
  const { handleAsyncError } = useAsyncHelpersContext();

  const queryPayloadRef = useRef<{ [key: string]: unknown }>({});
  const [selectedAidService, setSelectedAidService] =
    useState<IAidService>(aidService);
  const [aidServicesResult, setAidServicesResult] = useState<
    IQueryResult<IAidService>
  >({} as IQueryResult<IAidService>);
  const [openAidServicesOverlay, setOpenAidServicesOverlay] = useState(false);

  return (
    <div>
      <div>
        <IonToolbar>
          <AidServiceCard aidService={aidService} />
          <IonIcon
            role="button"
            aria-label="open view to change the service"
            onClick={() => setOpenAidServicesOverlay(!openAidServicesOverlay)}
            slot="end"
            icon={addSharp}
          ></IonIcon>
        </IonToolbar>
        <IonModal
          isOpen={openAidServicesOverlay}
          onDidDismiss={() => setOpenAidServicesOverlay(false)}
        >
          <IonContent>
            <IonItem>
              <IonButton
                fill="clear"
                onClick={() => setOpenAidServicesOverlay(false)}
                aria-label="CLOSE"
                slot="end"
              >
                <IonIcon icon={closeCircle}></IonIcon>
              </IonButton>
            </IonItem>
            <IonGrid>
              <IonRow>
                <IonCol size="12">
                  <IonLabel>
                    <h3>Search for Aid Services </h3>
                    <p>
                      You can search for alternative aid services, search by
                      anything from service name to disability types: visual,
                      hearing etc
                    </p>
                  </IonLabel>
                  <IonSearchbar
                    type="text"
                    onIonInput={(evt) => {
                      queryPayloadRef.current = {
                        searchTerm: evt.detail.value,
                      };
                      getData<IQueryResult<IAidService>>(
                        `${APIBaseURL}/aid-service`,
                        queryPayloadRef.current
                      )
                        .then((res) => {
                          if(evt.detail.value && evt.detail.value?.length <= 3) return;
                          
                          setAidServicesResult({ ...res });
                          setOpenAidServicesOverlay(true);
                        })
                        .catch((err) => {
                          handleAsyncError(err, "Error searching aid services");
                        });
                    }}
                    debounce={300}
                  />
                </IonCol>
              </IonRow>
              {openAidServicesOverlay && (
                <>
                  {aidServicesResult.data?.length > 0 &&
                    aidServicesResult.data?.map((aService) => (
                      <IonRow key={aService.id}>
                        <IonCol size="10">
                          <AidServiceCard aidService={aService} />
                        </IonCol>
                        <IonCol size="2">
                          <span
                            role="button"
                            className="ion-margin"
                            aria-label={`select ${aService.name}`}
                            onClick={() => {
                              setSelectedAidService(aService);
                              setOpenAidServicesOverlay(false);
                              onSelection(aService);
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
                      {aidServicesResult.data?.length > 0 ? (
                        <Pagination
                          setQueryResult={setAidServicesResult}
                          queryBaseUrl={`${APIBaseURL}/aid-service`}
                          queryPayloadRef={queryPayloadRef}
                          totalItems={aidServicesResult.total || 0}
                          limit={50}
                        />
                      ) : (
                        <h4 className="ion-text-center">
                          No Services, search to find
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
