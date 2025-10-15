import { useEffect, useRef, useState } from "react";
import { APIBaseURL, getData } from "../../shared/api/base";
import { IQueryResult } from "../../shared/interfaces/api-response";
import { useAsyncHelpersContext } from "../../shared/contexts/async-helpers";
import { getLocalUser } from "../../utils";
import { IonIcon, IonItem, IonLabel, IonList } from "@ionic/react";
import { Pagination } from "../../shared/components/general/Pagination";
import { folderOpenOutline } from "ionicons/icons";
import { IPaymentTransaction } from "../interfaces/payment";
import { PaymentTransactionCard } from "./PaymentTransactionCard";

export interface IPaymentTransactionsProps {
  queryPayload: { [key: string]: unknown };
}

export const ServiceTransactions = ({ queryPayload }: IPaymentTransactionsProps) => {
  const { setLoading, handleAsyncError } = useAsyncHelpersContext();

  const queryPayloadRef = useRef<{ [key: string]: unknown }>(queryPayload);
  const queryBaseUrl = `${APIBaseURL}/transaction`;
  const reportComments = useRef<IQueryResult<IPaymentTransaction>>(
    {} as IQueryResult<IPaymentTransaction>
  );

  const [transactionsResult, setAidServiceProfilesResult] = useState<
    IQueryResult<IPaymentTransaction>
  >({} as IQueryResult<IPaymentTransaction>);
  const getItems = async () => {
    try {
      setLoading({ isLoading: true, loadingMessage: "getting items" });
      const res = await getData<IQueryResult<IPaymentTransaction>>(
        queryBaseUrl,
        queryPayloadRef.current
      );
      setAidServiceProfilesResult(res);
      setLoading({ isLoading: false, loadingMessage: "" });
    } catch (error) {
      handleAsyncError(error, "Error getting items");
    }
  };
  useEffect(() => {
    getItems();
  }, []);

  return (
    <div>
      <IonList>
        {transactionsResult.data?.map((trx, index ) => (
          <div style={{display: "flex"}} key={trx.id} className="ion-margin">
            <div style={{fontSize: "2em"}}>
                {index + 1}
            </div>
             <PaymentTransactionCard
            paymentTransaction={trx}
          />
          </div>
        ))}

        {!transactionsResult.data?.length && (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "3em" }}>
              <IonIcon icon={folderOpenOutline}></IonIcon>
            </div>
            <div>No items.</div>
          </div>
        )}
      </IonList>

      <Pagination
        queryBaseUrl={queryBaseUrl}
        queryPayloadRef={queryPayloadRef}
        setQueryResult={setAidServiceProfilesResult}
        limit={10}
        totalItems={transactionsResult.total}
      />
    </div>
  );
};
