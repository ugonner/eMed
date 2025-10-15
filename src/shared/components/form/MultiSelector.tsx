import { useState } from "react";
import "./MultiSelector.css";
import { IonAvatar, IonContent, IonIcon, IonItem, IonLabel, IonModal, IonSearchbar } from "@ionic/react";
import { caretDownSharp, caretUpSharp, checkboxSharp, closeSharp } from "ionicons/icons";

export interface ISelectOption {
  name: string;
  value: unknown;
}

export interface IMultipleSelectorProps {
  initValues: ISelectOption[];
  options: ISelectOption[];
  onSelection: (opts: ISelectOption[]) => void;
  label: string;
}

export const MultiSelector = ({
  initValues,
  options,
  onSelection,
  label,
}: IMultipleSelectorProps) => {
  
  const [selectedOptions, setSelectedOptions] = useState<ISelectOption[]>(
    initValues || []
  );

  options = options.filter((opt) => !(selectedOptions.find((iValue) => iValue.value === opt.value)));
  const [availableOptions, setAvailableOptions] = useState<ISelectOption[]>(options);


  const [openSelectorOverlay, setOpenSelectorOverlay] = useState(false);

 
  return (
    <div>
      <div
        role="button"
        aria-label={label}
        onClick={() => setOpenSelectorOverlay(!openSelectorOverlay)}
      >
        <IonItem>
            <IonAvatar>
                <IonIcon icon={caretDownSharp} size="large"></IonIcon>
            </IonAvatar>
            <IonLabel>
                <h3>{label}</h3>
                <h6>Please click to select or unsolect options by clicking the option</h6>
                <p>
                  {selectedOptions?.map((item) => (
                    <span key={item.value as string} className="ion-margin-horizontal">{item.name}</span>
                  ))}
                </p>
            </IonLabel>
        </IonItem>
      </div>

      <IonModal
        isOpen={openSelectorOverlay}
        onDidDismiss={() => setOpenSelectorOverlay(false)}
      >
        <IonContent>
          <IonItem>
            {
                ["save", "cancel"].map((item, index) => (
                    <span key={index} className="ion-margin"
                    role="button"
                    onClick={() => {
                        if(item === "save") onSelection(selectedOptions);
                        setOpenSelectorOverlay(false);
                        return;
                    }}>
                        {item}
                    </span>
                ))
            }
            
          </IonItem>
          <div style={{ display: "flex", overflow: "auto" }}>
            {selectedOptions.map((item, index) => (
              <div
                key={index}
                className="embossed-tile ion-background-danger ion-text-white"
                role="button"
                aria-label="remove"
                onClick={() => {
                  setSelectedOptions((prev) =>
                    prev.filter((opt) => opt.value !== item.value)
                  );
                  setAvailableOptions([...availableOptions, item])
                }}
              >
                <span style={{ fontSize: "0.5em" }}>{item.name}</span>
              </div>
            ))}
          </div>
          <div>
            <IonItem>
                <IonSearchbar
                onIonInput={(evt) => {
                    setAvailableOptions(
                        options.filter((opt) => {
                            return (new RegExp(evt.detail.value as string, "i").test(opt.name))
                        })
                    )
                }}
                aria-label="search options"
                />
            </IonItem>
          </div>
          <div style={{ display: "flex", overflow: "auto" }}>
            {availableOptions.map((item, index) => (
              <div
                key={index}
                className="embossed-tile"
                role="button"
                aria-label="add"
                onClick={() => {
                  setSelectedOptions([...selectedOptions, item]);
                  setAvailableOptions((prev) => prev.filter((opt) => opt.value !== item.value))
                }}
              >
                <span style={{ fontSize: "0.5em" }}>{item.name}</span>
              </div>
            ))}
          </div>
        </IonContent>
      </IonModal>
    </div>
  );
};
