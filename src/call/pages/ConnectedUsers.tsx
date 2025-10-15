import { useEffect, useState } from "react";
import { useRTCContextStore } from "../contexts/rtc";
import { IConnectedUser } from "../../user/interfaces/user";
import { BroadcastEvents } from "../enums/events.enum";
import { IApiResponse } from "../../shared/interfaces/api-response";
import { usePresentToast } from "../../utils";
import {
  IonButton,
  IonCol,
  IonGrid,
  IonIcon,
  IonItem,
  IonRow,
} from "@ionic/react";
import { callSharp } from "ionicons/icons";
import { InitCallDTO } from "../dtos/call.dto";
import { callPurpose, CallType, RoomType } from "../enums/call.enum";
import { usePlainRTCContextStore } from "../contexts/plainwebrtc";

export const ConnectedUsers = () => {
  const { presentToastMessage } = usePresentToast();

  const { socketRef, callReceiver, socketLoaded } = usePlainRTCContextStore();
  const [connectedUsers, setConnectedUsers] = useState<IConnectedUser[]>([]);

  const getConnectedUsers = async () => {
    try {
      console.log("getting user");
      const res: IApiResponse<IConnectedUser[]> = await new Promise(
        (resolve) => {
          socketRef.current?.emit(
            BroadcastEvents.GET_CONNECTED_USERS,
            {},
            resolve
          );
        }
      );
      console.log("res", res);
      if (res.error) throw new Error(res.message);
      setConnectedUsers(res.data as IConnectedUser[]);
    } catch (error) {
      console.log("Error getting connected users", (error as Error).message);
      presentToastMessage((error as Error).message);
    }
  };

  useEffect(() => {
    if (socketLoaded) getConnectedUsers();
  }, [socketLoaded]);

  return (
    <IonGrid>
      <IonRow>
        <IonCol>
          <h1>Connectd Users</h1>
        </IonCol>
      </IonRow>
      <IonRow>
        {connectedUsers.map((usr, index) => {
          return usr.socketId ? (
            <IonCol key={index} size="12">
              <IonItem>
                <h2>{usr.socketId}</h2>
                <IonButton
                  slot="end"
                  onClick={() => {
                    callReceiver({
                      peerSocketId: usr.socketId as string,
                      roomType: RoomType.PEER_TO_PEER,
                      roomId: `${`bonnaroom${socketRef.current?.id}`}`,
                      callPurpose: callPurpose.NORMAL,
                      callType: CallType.VIDEO
                    });
                  }}
                >
                  <IonIcon icon={callSharp} size="large"></IonIcon>
                </IonButton>
              </IonItem>
            </IonCol>
          ) : (
            <div key={index}></div>
          );
        })}
      </IonRow>
    </IonGrid>
  );
};
