import { IonAvatar, IonIcon, IonItem, IonLabel } from "@ionic/react";
import { ICallRoom } from "../interfaces/call";
import { arrowDownCircle, arrowUpCircle, callSharp, timeSharp } from "ionicons/icons";
import { IProfile } from "../../user/interfaces/user";
import { getDuration } from "../../utils";

export interface ICallRoomCardProps {
    callRoom: ICallRoom;
    localUser: IProfile
}

export const CallRoomCard = ({callRoom, localUser}: ICallRoomCardProps) => {
    return (
        <IonItem>
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
                            {callRoom.initiatedBy === localUser.userId ? (
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
    )
}