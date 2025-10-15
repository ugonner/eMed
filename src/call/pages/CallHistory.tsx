import { useEffect } from "react";
import { ICallRoom } from "../interfaces/call";
import { LocalStorageEnum } from "../../shared/enums";
import {
  IonAvatar,
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonToolbar,
} from "@ionic/react";
import {
  arrowDown,
  arrowDownCircle,
  arrowUpCircle,
  callSharp,
  timeSharp,
} from "ionicons/icons";
import { IAuthUserProfile } from "../../user/interfaces/user";
import { getDuration } from "../../utils";

export const CallHistory = () => {
  const localHistory = localStorage.getItem(LocalStorageEnum.CALL_HISTORY);
  const callHistory: ICallRoom[] =
    localHistory == undefined ? [] : JSON.parse(localHistory);
  const localUser = localStorage.getItem(LocalStorageEnum.USER);
  const user: IAuthUserProfile =
    localUser == undefined ? {} : JSON.parse(localUser);

  return (
    <IonContent>
      <IonToolbar>
        <h1>Call History</h1>
      </IonToolbar>
      <div style={{ overflow: "auto" }}>
        <IonList>
          {callHistory.map((callRoom, index) => (
            <IonItem key={index}>
              <IonAvatar>
                <IonIcon icon={callSharp}></IonIcon>
              </IonAvatar>
              <IonLabel>
                <h1>
                  {(callRoom.callMembers || []).map(
                    (member) => member.userName
                  )}
                </h1>
                <p>
                  <small>
                    {callRoom.initiatedBy === user.userId ? (
                      <IonIcon icon={arrowUpCircle} size="small"></IonIcon>
                    ) : (
                      <IonIcon
                        icon={callRoom.answered ? timeSharp : arrowDownCircle}
                      ></IonIcon>
                    )}
                    <small>
                      {" "}
                      {new Date(callRoom.startTime).toISOString()}{" "}
                    </small>
                  </small>
                </p>
                <p>
                  {callRoom.callPurpose} |{" "}
                  {getDuration(
                    Number(callRoom.startTime), Number(callRoom.endTime)
                  )}
                </p>
              </IonLabel>
            </IonItem>
          ))}
        </IonList>
      </div>
    </IonContent>
  );
};
