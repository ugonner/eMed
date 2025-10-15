import { Dispatch, MutableRefObject, SetStateAction, useState } from "react";
import {
  AlertButton,
  AlertInput,
  IonButton,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonModal,
  IonPopover,
  IonRow,
  IonSelect,
  IonSelectOption,
  IonText,
  useIonAlert,
  useIonToast,
} from "@ionic/react";
import { closeCircle } from "ionicons/icons";
import { IQueryResult } from "../../interfaces/api-response";
import { getData } from "../../api/base";
import { DateSelector } from "../form/DateSelector";
import { ISelectOption } from "../form/MultiSelector";

export interface IQueryInput {
  name: string;
  type: "textInput" | "select" | "range" | "dateRange" | "date";
  value: string | string[] | number | number[] | ISelectOption[];
  upperLimitFieldName?: string;
  lowerLimitFieldName?: string;
}

export interface IQueryFilterProps<QueryResultType> {
  queryPayloadRef: MutableRefObject<{ [key: string]: unknown }>;
  queryUrl: string;
  setResult: Dispatch<SetStateAction<IQueryResult<QueryResultType>>>;
  queryInputs: IQueryInput[];
}

export const QueryFilter = ({
  queryUrl,
  queryInputs,
  setResult,
  queryPayloadRef,
}: IQueryFilterProps<any>) => {
  const [openTextInputOverlay, setOpenTextInputOverlay] = useState(false);
  const [openSelectInputOverlay, setOpenSelectInputOverlay] = useState(false);
  const [openFilterOverlay, setOpenFilterOverlay] = useState(false);
  const [currentTextInputName, setCurrentTextInputName] = useState("");
  const [currentSelectOptions, setCurrentSelectOptions] = useState<
    ISelectOption[]
  >([]);

  const [presentAlert] = useIonAlert();
  const [presentToast] = useIonToast();
  const [queryObject, setQueryObject] = useState<{ [key: string]: unknown }>(
    {}
  );
  const [openDateSelectOverlay, setOpenDateSelectOverlay] = useState<{
    open: boolean;
    isDateRange?: boolean;
  }>();

  const getResult = async (queryObject: {[key: string]: unknown}) => {
    try {
        //alert(JSON.stringify(queryObject));
        console.log("query object", queryObject);
        const res = await getData<IQueryResult<unknown>>(
          queryUrl,
          queryObject
        );
        queryPayloadRef.current = queryObject;
        setResult(res);
        setOpenFilterOverlay(false);
      } catch (error) {
        presentToast("Error fetching data, try again", 3000);
        console.log(
          "Error fetching filtered data",
          (error as Error).message
        );
      }
  }

  const displayQueryInput = (input: IQueryInput) => {
    if (input.type === "range") {
      if (!input.upperLimitFieldName || !input.lowerLimitFieldName) {
        presentToast(
          `No lower or upper limit field names supplied for a range filter input type`,
          5000
        );
        console.log(
          `No lower or upper limit field names supplied for a range filter input type`
        );
        return;
      }

      presentAlert({
        message: `Select ${input.name} range`,
        buttons: (input.value as string[]).map(
          (inputValue, index, inputArray) => {
            return {
              text: `${inputValue} - ${inputArray[index + 1] || ""}`,
              handler: () => {
                setQueryObject({
                  ...queryObject,
                  [`${input.lowerLimitFieldName}`]: inputValue,
                  [`${input.upperLimitFieldName}`]: inputArray[index + 1] || "",
                });
              },
              role: "destructive",
            } as AlertButton;
          }
        ),
      });
    }

    if (input.type === "select") {
      if (!Array.isArray(input.value)) {
        console.log("Select filter input type must have an array input values");
        return;
      }
      setCurrentTextInputName(input.name);
      setCurrentSelectOptions(
        (input.value as ISelectOption[]).filter((x) => x.value && x.name)
      );
      setOpenSelectInputOverlay(true);
    }

    if (input.type === "date") {
      setOpenDateSelectOverlay({ open: true, isDateRange: false });
    }
    if (input.type === "dateRange") {
      setOpenDateSelectOverlay({ open: true, isDateRange: true });
    }

    if (input.type === "textInput") {
      setCurrentTextInputName(input.name);
      setOpenTextInputOverlay(true);
    }
  };

  return (
    <div>
      <IonItem>
        <IonButton
          fill="clear"
          onClick={() => setOpenFilterOverlay(!openFilterOverlay)}
        >
          <IonText id="filter-trigger">Filter</IonText>
        </IonButton>

        <IonButton
          fill="clear"
          onClick={() => {
            setQueryObject({});
            getResult({});
          }}
        >
          Clear Filters
        </IonButton>
      </IonItem>

      <IonPopover
        trigger="filter-trigger"
        isOpen={openFilterOverlay}
        onDidDismiss={() => setOpenFilterOverlay(false)}
      >
        <div>
          <IonItem>
            <IonText> Filter </IonText>
            <IonButton
              slot="end"
              fill="clear"
              onClick={() => setOpenFilterOverlay(false)}
              aria-label="close"
            >
              x
            </IonButton>
          </IonItem>
          <div>
            {queryInputs.map((input, index) => (
              <IonItem key={index}>
                <IonButton
                  key={index}
                  fill="clear"
                  onClick={() => displayQueryInput(input)}
                  expand="full"
                >
                  {input.name}
                </IonButton>
              </IonItem>
            ))}
            <IonItem>
              <IonButton
                fill="clear"
                onClick={async () => {
                  getResult(queryObject)
                }}
              >
                Get Results
              </IonButton>
            </IonItem>
          </div>
        </div>
      </IonPopover>
      <IonPopover
        isOpen={openTextInputOverlay}
        onDidDismiss={() => setOpenTextInputOverlay(false)}
      >
        <div>
          <IonItem>
            <h3>{`Set ${currentTextInputName}`}</h3>
          </IonItem>
          <IonItem className="no-line">
            <IonInput
              type="text"
              label={currentTextInputName}
              labelPlacement="stacked"
              fill="outline"
              name={currentTextInputName}
              onIonInput={(evt) => {
                const { name, value } = evt.target;
                setQueryObject({ ...queryObject, [name]: value });
              }}
            ></IonInput>
          </IonItem>
          <IonItem>
            <IonButton
              fill="clear"
              onClick={() => setOpenTextInputOverlay(false)}
            >
              <IonText>Ok</IonText>
            </IonButton>
          </IonItem>
        </div>
      </IonPopover>

      <IonPopover
        isOpen={openSelectInputOverlay}
        onDidDismiss={() => setOpenSelectInputOverlay(false)}
      >
        <div>
          <IonItem>
            <h3>Select {currentTextInputName}</h3>
          </IonItem>
          <IonItem>
            <IonSelect
              multiple={true}
              onIonChange={(evt: CustomEvent) => {
                const { value } = evt.detail;
                setQueryObject({
                  ...queryObject,
                  [currentTextInputName]: (value as string[]).join(","),
                });
              }}
            >
              <IonSelectOption value={null}>
                Please Select Options
              </IonSelectOption>
              {currentSelectOptions.map((opt) => (
                <IonSelectOption key={opt.value as number} value={opt.value}>
                  {opt.name}
                </IonSelectOption>
              ))}
            </IonSelect>
          </IonItem>
        </div>
      </IonPopover>
      <IonModal
        isOpen={openDateSelectOverlay?.open}
        onDidDismiss={() => setOpenDateSelectOverlay({ open: false })}
      >
        <IonHeader>
          <IonItem>
            <IonButton
              role="dismiss"
              fill="clear"
              aria-label="close date selection"
              onClick={() => setOpenDateSelectOverlay({ open: false })}
              slot="end"
            >
              <IonIcon icon={closeCircle}></IonIcon>
            </IonButton>
          </IonItem>
        </IonHeader>
        <IonContent>
          <IonGrid>
            <IonRow>
              {openDateSelectOverlay?.isDateRange ? (
                <>
                  {["startDate", "endDate"].map((field) => (
                    <IonCol key={field} size="12">
                      <DateSelector
                        label={field.replace(/([A-Z])/, " $1").toUpperCase()}
                        initDate={
                          new Date((queryObject[field] as string) || Date.now())
                        }
                        onSelection={(date: Date | null) => {
                          setQueryObject({
                            ...queryObject,
                            [field]: date?.toISOString().split("T")[0],
                          });
                        }}
                      />
                    </IonCol>
                  ))}
                </>
              ) : (
                <IonCol size="12">
                  <DateSelector
                    label={`Select Date`}
                    initDate={
                      new Date((queryObject["dDate"] as string) || Date.now())
                    }
                    onSelection={(date: Date | null) => {
                      setQueryObject({
                        ...queryObject,
                        dDate: date?.toISOString().split("T")[0],
                      });
                    }}
                 />
                </IonCol>
              )}
            </IonRow>
            <IonRow>
              <IonCol size="12">
                <IonItem>
                  <IonButton
                    color={"dark"}
                    onClick={() => setOpenDateSelectOverlay({ open: false })}
                    role="dismiss"
                    slot="end"
                    size="large"
                  >
                    Ok
                  </IonButton>
                </IonItem>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonContent>
      </IonModal>
    </div>
  );
};
