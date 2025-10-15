import { useEffect, useRef, useState } from "react";
import { IReport } from "../interfaces/report";
import { ReportMenuActions } from "../enums/report";
import { getLocalUser } from "../../utils";
import { useAuthGuardContextStore } from "../../auth/contexts/AuthGuardContext";
import { useAsyncHelpersContext } from "../../shared/contexts/async-helpers";
import { APIBaseURL, postData } from "../../shared/api/base";
import {
  IonButton,
  IonContent,
  IonIcon,
  IonInput,
  IonItem,
  IonList,
  IonModal,
  IonPopover,
  IonTextarea,
} from "@ionic/react";

export interface IReportMenuProps {
  report: IReport;
  onCompletion?: () => void;
}

export const ReportMenu = ({ report, onCompletion }: IReportMenuProps) => {
  const { isAdmin } = useAuthGuardContextStore();
  const { setLoading, handleAsyncError } = useAsyncHelpersContext();

  const actionsRef = useRef<ReportMenuActions[]>([]);

  const [openActionOverlay, setOpenActionOverlay] = useState(false);
  const [openMenuOverlay, setOpenMenuOverlay] = useState(false);
  const [comment, setComment] = useState<string>();
  const [isResolved, setIsResoved] = useState<boolean>(report.isResolved);
  const currentActionRef = useRef<ReportMenuActions>();

  const user = getLocalUser();
  const isEntityOwner = report?.entityOwner?.userId === user?.userId;
  const isOwner = report?.profile?.userId === user?.userId;

  const takeAction = async (action: ReportMenuActions) => {
    try {
      setLoading({ isLoading: true, loadingMessage: `${action}` });
      if (action === ReportMenuActions.REPLY) {
        await postData(`${APIBaseURL}/report/${report.id}/comment`, {
          method: "post",
          comment,
        });
      } else if (action === ReportMenuActions.RESOLVE) {
        await postData(`${APIBaseURL}/report/${report.id}/resolve`, {
          method: "put",
          isResolved,
        });
      }
      setLoading({ isLoading: false, loadingMessage: "" });
      setOpenMenuOverlay(false)
      setOpenActionOverlay(false);
      if(onCompletion) onCompletion();
    } catch (error) {
      handleAsyncError(error, `Error ${action} on report`);
    }
  };
  useEffect(() => {
    if (isEntityOwner || isOwner || isAdmin)
      actionsRef.current = [ReportMenuActions.REPLY];
    if (isAdmin) actionsRef.current.push(ReportMenuActions.RESOLVE);
  }, []);

  return (
    <div>
      <div>
        <IonIcon
          role="button"
          id={`report-menu-toggler-${report.id}`}
          onClick={() => setOpenMenuOverlay(!openMenuOverlay)}
          aria-label="open or close menu"
        ></IonIcon>
      </div>
      <IonPopover
        trigger={`report-menu-toggler-${report.id}`}
        isOpen={openMenuOverlay}
        onDidDismiss={() => setOpenMenuOverlay(false)}
      >
        <IonList>
          {actionsRef.current.map((action) => (
            <IonItem
              role="button"
              aria-label={action}
              onClick={() => {
                currentActionRef.current = action;
                setOpenActionOverlay(!openActionOverlay);
              }}
            >
              {action}
            </IonItem>
          ))}
        </IonList>
      </IonPopover>

      <IonModal
        isOpen={openActionOverlay}
        onDidDismiss={() => setOpenActionOverlay(false)}
      >
        <IonContent>
          <h3>{currentActionRef.current}</h3>
          {currentActionRef.current === ReportMenuActions.REPLY && (
            <IonItem>
              <IonTextarea
                label="Reply"
                labelPlacement="floating"
                value={comment}
                onIonInput={(evt) => {
                  setComment(evt.detail.value as string);
                }}
              />
            </IonItem>
          )}
          <p>
            You can proceed to confrim your action by clicking the confirm
            button or cancel otherwise.
          </p>
          <IonItem>
            <IonButton
            expand="full"
              onClick={() =>
                takeAction(currentActionRef.current as ReportMenuActions)
              }
            >
              <span style={{ color: "white" }}>
                Confirm
              </span>
            </IonButton>
            <IonButton
            expand="full"
            onClick={() => {
                setOpenActionOverlay(false);
                setOpenMenuOverlay(false);
                
            }}
            >
                <span style={{color: "white"}}>Cancel</span>
            </IonButton>

          </IonItem>
        </IonContent>
      </IonModal>
    </div>
  );
};
