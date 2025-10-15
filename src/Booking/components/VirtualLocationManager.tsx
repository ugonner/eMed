import {
  IonAvatar,
  IonCol,
  IonContent,
  IonGrid,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonModal,
  IonRow,
} from "@ionic/react";
import { VirtualLocationAddressDTO } from "../dtos/virtual-location.dto";
import { addCircleSharp, closeCircle, cloudSharp } from "ionicons/icons";
import { formatCamelCaseToSentence } from "../../shared/helpers";
import { useState } from "react";

export interface IVirtualLocationAddressManagerProps {
  virtualLocationAddress: VirtualLocationAddressDTO;
  onSelection?: (address: VirtualLocationAddressDTO) => void;
}

export const VirtualLocationAddressCard = ({
  virtualLocationAddress,
}: {
  virtualLocationAddress: VirtualLocationAddressDTO;
}) => {
  return (
    <IonItem>
      <IonAvatar>
        <IonIcon icon={cloudSharp} size="large"></IonIcon>
      </IonAvatar>
      <IonLabel>
        <h3>Set Virtual Event Detail</h3>
        {Object.keys(virtualLocationAddress || {}).map((item, index) => (
          <p key={index}>
            {formatCamelCaseToSentence(item)}
            <span style={{ fontWeight: "bold" }}>
              {(virtualLocationAddress as any)[item]}
            </span>
          </p>
        ))}
      </IonLabel>
    </IonItem>
  );
};

export const VirtualLocationAddressManager = ({
  virtualLocationAddress,
  onSelection,
}: IVirtualLocationAddressManagerProps) => {
  const [virtualAddressDto, setVirtualAddressDto] =
    useState<VirtualLocationAddressDTO>(
      virtualLocationAddress || ({} as VirtualLocationAddressDTO)
    );

  const [openVirtualAddressOverlay, setOpenVirtualAddressOverlay] =
    useState(false);

  const inputFields: string[] = [
    "linkAddress",

    "passCode",

    "userName",

    "platform",

    "additionalNotes",
  ];

  return (
    <div>
      <IonGrid>
        <IonRow>
          <IonCol 
          role="button"
          aria-label="open / close address form"
          onClick={() =>
            setOpenVirtualAddressOverlay(!openVirtualAddressOverlay)
          }
          size="12">
            
        <VirtualLocationAddressCard
          virtualLocationAddress={virtualAddressDto}
        />
          </IonCol>
        </IonRow>
      </IonGrid>
      <IonModal
        isOpen={openVirtualAddressOverlay}
        onDidDismiss={() => setOpenVirtualAddressOverlay(false)}
      >
        <IonContent>
          <IonGrid>
            <IonRow>
              <IonItem>
                <IonIcon
                  slot="end"
                  icon={closeCircle}
                  role="button"
                  aria-label="close"
                  onClick={() => setOpenVirtualAddressOverlay(false)}
                ></IonIcon>
              </IonItem>
            </IonRow>
            {inputFields.map((input, index) => (
              <IonRow key={index}>
                <IonCol size="12">
                  <IonItem>
                    <IonInput
                      type={input === "linkAddress" ? "url" : "text"}
                      label={formatCamelCaseToSentence(input)}
                      labelPlacement="floating"
                      value={(virtualAddressDto as any)[input]}
                      onIonInput={(evt) => {
                        setVirtualAddressDto({
                          ...(virtualAddressDto || {}),
                          [input]: evt.detail.value,
                        } as VirtualLocationAddressDTO);
                      }}
                    />
                  </IonItem>
                </IonCol>
              </IonRow>
            ))}
            <IonRow>
              <IonCol size="12">
                {["save", "cancel"].map((item) => (
                  <span
                    key={item}
                    role="button"
                    className="ion-margin"
                    onClick={() => {
                      if (item === "save" && onSelection)
                        onSelection(virtualAddressDto);
                      setOpenVirtualAddressOverlay(false);
                    }}
                  >
                    {item}
                  </span>
                ))}
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonContent>
      </IonModal>
    </div>
  );
};
