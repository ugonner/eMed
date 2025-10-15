import { useEffect, useRef, useState } from "react";
import { APIBaseURL, getData } from "../../shared/api/base";
import { IQueryResult } from "../../shared/interfaces/api-response";
import { IReportComment } from "../interfaces/report-comment";
import { useAsyncHelpersContext } from "../../shared/contexts/async-helpers";
import { getLocalUser } from "../../utils";
import { IonItem, IonLabel, IonList } from "@ionic/react";
import { ReportCommentCard } from "./ReportComment";
import { Pagination } from "../../shared/components/general/Pagination";

export interface IReportCommentsProps {
  reportId: number;
}

export const ReportComments = ({ reportId }: IReportCommentsProps) => {
  const { setLoading, handleAsyncError } = useAsyncHelpersContext();

  const queryPayloadRef = useRef<{ [key: string]: unknown }>({ reportId });
  const queryBaseUrl = `${APIBaseURL}/report/comment/${reportId}`;
  const reportComments = useRef<IQueryResult<IReportComment>>(
    {} as IQueryResult<IReportComment>
  );

  const user = getLocalUser();

  const [reportCommentsResult, setReportCommentsResult] = useState<
    IQueryResult<IReportComment>
  >({} as IQueryResult<IReportComment>);
  const getItems = async () => {
    try {
      setLoading({ isLoading: true, loadingMessage: "getting items" });
      const res = await getData<IQueryResult<IReportComment>>(
        queryBaseUrl,
        queryPayloadRef.current
      );
      setReportCommentsResult(res);
      setLoading({ isLoading: false, loadingMessage: "" });
    } catch (error) {
      handleAsyncError(error, "Error getting items");
    }
  };
  useEffect(() => {
    getItems();
  }, [reportId]);

  return (
    <div>
      <IonList>
        {reportCommentsResult.data?.map((reportComment) => (
          <ReportCommentCard
            key={reportComment.id}
            reportComment={reportComment}
          />
        ))}
      </IonList>
      <Pagination
      queryBaseUrl={queryBaseUrl}
      queryPayloadRef={queryPayloadRef}
      setQueryResult={setReportCommentsResult}
      limit={10}
      totalItems={reportCommentsResult.total}
      />
    </div>
  );
};
