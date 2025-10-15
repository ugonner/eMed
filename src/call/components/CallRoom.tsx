import { IonCol, IonGrid, IonRow } from "@ionic/react";
import { CallToolBar } from "./CallToolBar";
import { usePlainRTCContextStore } from "../contexts/plainwebrtc";
import { ConsumingVideo } from "./video/ConsumingVideo";

export const CallRoom = () => {
  const { roomUsers, calleePeerUserRef, incomingPeerUserRef, peerCallStage } =
    usePlainRTCContextStore();

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        minHeight: "600PX",
        maxHeight: "100%",
        overflow: "auto",
      }}
    >
      <div>
        <IonGrid>
          <IonRow>
            {roomUsers.map((usr, index) => (
              <IonCol key={index} size={roomUsers.length === 1 ? "12" : "6"}>
                <ConsumingVideo producerUser={usr} />
              </IonCol>
            ))}
          </IonRow>
        </IonGrid>
      </div>

      <div
        style={{
          position: "fixed",
          bottom: 10,
          left: 0,
          right: 0,
        }}
      >
        <CallToolBar />
      </div>
      {/* <div>
        <Captioning mediaStream={userMediaStreamRef.current as MediaStream} />
      </div> */}
    </div>
  );
};
