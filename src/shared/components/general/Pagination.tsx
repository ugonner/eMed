import { Dispatch, MutableRefObject, RefObject, SetStateAction, useState } from "react";
import { IonButton, IonItem } from "@ionic/react";
import { IQueryResult } from "../../interfaces/api-response";
import { useAsyncHelpersContext } from "../../contexts/async-helpers";
import { getData } from "../../api/base";

export interface IPaginationProps {
    queryPayloadRef: MutableRefObject<{[key: string]: unknown}>;
    queryBaseUrl: string;
    setQueryResult: Dispatch<SetStateAction<IQueryResult<any>>>;
    totalItems: number;
    limit: number;
}

export const Pagination = ({queryBaseUrl, queryPayloadRef, setQueryResult, totalItems, limit}: IPaginationProps) => {
   const {setLoading, handleAsyncError} = useAsyncHelpersContext();
    const [page, setPage] = useState(1);

   const noOfPages = Math.ceil(totalItems / limit);
   const pages = [];
   for(let i = 1; i <= noOfPages; i++){
      pages.push(i);
   };

    const getResult = async (queryPayload: {[key: string]: unknown}) => {
        try{
            setLoading({isLoading: true, loadingMessage: "getting paginated results"});
            const res = await getData<IQueryResult<any>>(queryBaseUrl, queryPayload);
            setQueryResult(res);
            setLoading({isLoading: false, loadingMessage: ""})
        }catch(error){
            console.log(`unable to fetch paginated result`, (error as Error).message);
            handleAsyncError(error, "Error getting paginated data")
        }
    }

    return (
        <IonItem>
            {
                pages.map((pageNumber) => (
                    <IonButton
                    key={pageNumber}
                    fill={page === pageNumber ? "solid" : "clear"}
                    color={page === pageNumber ? "dark" : "primary"}
                    aria-label={`navigate to page ${pageNumber}`}
                    onClick={async () => {
                        queryPayloadRef.current = {...queryPayloadRef.current, page: pageNumber, limit};
                        getResult(queryPayloadRef.current);
                        setPage(pageNumber);
                    }}>
                        {pageNumber}
                    </IonButton>
                ))
            }
        </IonItem>
    )
}