import {
  IonButton,
  IonCol,
  IonContent,
  IonGrid,
  IonIcon,
  IonItem,
  IonModal,
  IonRow,
} from "@ionic/react";
import { useIInitContextStore } from "../../shared/contexts/InitContextProvider";
import { useRef, useState } from "react";
import {
  briefcaseSharp,
  closeCircle,
  hammerSharp,
  peopleSharp,
  pinSharp,
} from "ionicons/icons";
import { formatCamelCaseToSentence } from "../../shared/helpers";
import { ServiceList } from "../../aid-service/components/ServiceList";
import { ServiceClusters } from "../../user/components/cluster/ServiceClusters";
import { ServiceRoles } from "../../user/components/role/ServiceRoles";

export const AdminDashboard = () => {
  const { clustersRef, aidServicesRef, rolesRef, tagsRef } =
    useIInitContextStore();
  const currentActionRef = useRef<
    "aidServices" | "clusters" | "roles" | "tags"
  >("aidServices");
  const [openActionOverlay, setOpenActionOverlay] = useState(false);

  const initData: {
    name: "aidServices" | "clusters" | "roles" | "tags";
    value: number;
    icon?: string;
  }[] = [
    {
      name: "aidServices",
      value: aidServicesRef.current.length,
      icon: briefcaseSharp,
    },
    {
      name: "clusters",
      value: clustersRef.current.length,
      icon: peopleSharp,
    },
    {
      name: "roles",
      value: rolesRef.current.length,
      icon: hammerSharp,
    },
    {
      name: "tags",
      value: tagsRef.current.length,
      icon: pinSharp,
    },
  ];

  return (
    <IonContent>
      <IonGrid>
        <IonRow>
          {initData.map((item) => (
            <IonCol size="6" key={item.name}>
              <div
                className="ion-text-center"
                role="button"
                aria-label={`${formatCamelCaseToSentence(item.name)}`}
                onClick={() => {
                  currentActionRef.current = item.name;
                  setOpenActionOverlay(!openActionOverlay);
                }}
              >
                <h1>{item.value}</h1>
                <small>
                  <IonIcon
                    icon={item.icon}
                    className="ion-margin-horizontal"
                  ></IonIcon>
                  <span>{formatCamelCaseToSentence(item.name)}</span>
                </small>
              </div>
            </IonCol>
          ))}
        </IonRow>
      </IonGrid>
      <IonModal
        isOpen={openActionOverlay}
        onDidDismiss={() => setOpenActionOverlay(false)}
      >
       <IonContent>
        <IonItem>
          <IonIcon
          slot="end"
          role="button"
          aria-label="close"
          onClick={() => setOpenActionOverlay(false)}
          icon={closeCircle}
          />

        </IonItem>
         <IonGrid>
          {currentActionRef.current === "aidServices" && <ServiceList onCompletion={() => setOpenActionOverlay(false)} />}
          {currentActionRef.current === "clusters" && <ServiceClusters onCompletion={() => setOpenActionOverlay(false)} />}
          {currentActionRef.current === "roles" && <ServiceRoles onCompletion={() => setOpenActionOverlay(false)} />}
          
        </IonGrid>
       </IonContent>
      </IonModal>
    </IonContent>
  );
};
