import { useRef, useState } from "react"
import { APIBaseURL, getData } from "../../shared/api/base";
import { IonCol, IonGrid, IonItem, IonRow, IonSearchbar } from "@ionic/react";
import { IQueryResult } from "../../shared/interfaces/api-response";
import { useAsyncHelpersContext } from "../../shared/contexts/async-helpers";
import { QueryFilter } from "../../shared/components/general/QueryFilter";
import { useIInitContextStore } from "../../shared/contexts/InitContextProvider";
import { ISelectOption } from "../../shared/components/form/MultiSelector";

import { Pagination } from "../../shared/components/general/Pagination";
import { IReviewAndRating } from "../interfaces/review";
import { ReviewAndRatingCard } from "./ReviewCard";


export const ReviewDashboard = () => {
    const {aidServicesRef, clustersRef} = useIInitContextStore();
    const {setLoading, handleAsyncError} = useAsyncHelpersContext();

    const queryPayloadRef = useRef<{[key: string]: unknown}>({});
    const [queryPayload, setQueryPayload] = useState<{[key: string]: unknown}>({});
    const queryBaseUrl = `${APIBaseURL}/review`;
    const [queryResult, setQueryResult] = useState<IQueryResult<IReviewAndRating>>({} as IQueryResult<IReviewAndRating>)
   
    const getResults = async () => {
        try{
            setLoading({isLoading: true, loadingMessage: "getting results"})
            const res = await getData<IQueryResult<IReviewAndRating>>(queryBaseUrl, {...queryPayloadRef.current});
            setQueryResult(res);
            setLoading({isLoading: false, loadingMessage: ""})
        }catch(error){
            handleAsyncError(error, "Error getting results");
        }
    }
   
    return (
        <IonGrid>
            <IonRow>
                <IonCol size="12">
                    <h2>ReviewAndRating</h2>
                </IonCol>
            </IonRow>
            <IonRow>
                <IonCol size="4">
                    <div className="ion-text-center">
                        {queryResult.total}
                        <br/> <small>Total</small>
                    </div>
                </IonCol>
                <IonCol size="4">
                    <IonItem>
                        <IonSearchbar
                        aria-label="search service profiles"
                        onIonInput={(evt) => {
                            if(evt.detail?.value && evt.detail?.value.length < 4) return;
                            queryPayloadRef.current = {...queryPayloadRef.current, searchTerm: evt.detail?.value};
                            getResults();
                        }}
                        />
                    </IonItem>
                </IonCol>
                <IonCol size="4">
                    <QueryFilter
                    queryPayloadRef={queryPayloadRef}
                    queryUrl={queryBaseUrl}
                    setResult={setQueryResult}
                    queryInputs={[
                        {
                            name: "isResolved",
                            type: "select",
                            value: [
                                {name: "Resolved", value: true},
                                {name: "Not Resolved", value: false}
                            ]
                        },
                        {
                            name: "dDay",
                            type: "dateRange",
                            value: [],
                            
                        },
                        {
                            name: "aidServiceId",
                            type: "select",
                            value: aidServicesRef.current.map((aidService) => ({
                                name: aidService.name, value: aidService.id
                            })) as ISelectOption[]
                        },
                        {
                            name: "clusterIds",
                            type: "select",
                            value: clustersRef.current.map((cluster) => ({
                                name: cluster.name, value: cluster.id
                            }))
                        }
                    ]}
                    />
                </IonCol>
            </IonRow>
                {
                    queryResult.data?.map((reviewAndRating) => (
                        <IonRow key={reviewAndRating.id}>
                            <IonCol size="11">
                                <ReviewAndRatingCard reviewAndRating={reviewAndRating} />
                            </IonCol>
                            <IonCol size="1">
                                {/* <ReviewAndRatingMenu reviewAndRating={reviewAndRating} /> */}
                            </IonCol>
                        </IonRow>
                    ))
                }
                <IonRow>
                    <IonCol size="12">
                        <Pagination
                        queryBaseUrl={queryBaseUrl}
                        queryPayloadRef={queryPayloadRef}
                        setQueryResult={setQueryResult}
                        limit={10}
                        totalItems={queryResult.total}
                        />
                    </IonCol>
                </IonRow>
        </IonGrid>
    )
}