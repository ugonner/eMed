import {
  IonAvatar,
  IonCol,
  IonContent,
  IonGrid,
  IonIcon,
  IonItem,
  IonLabel,
  IonModal,
  IonRow,
} from "@ionic/react";
import { calendarOutline, calendarSharp, timeOutline, timeSharp } from "ionicons/icons";
import { useState } from "react";
import "./MultiSelector.css";

export interface IDateSelectorProps {
  initDate: Date;
  onSelection: (date: Date) => void;
  startYear?: number;
  label: string;
}

export const getNumberRange = (
  startNumber: number,
  rangeLength: number
): number[] => {
  const numberRange: number[] = [];
  const maxNumber = startNumber === 0 ? (startNumber + rangeLength) : ((startNumber + rangeLength) - 1)
  for (let i = startNumber; i <= maxNumber; i++) {
    numberRange.push(i);
  }
  return numberRange;
};

export const DateSelector = ({
  initDate,
  onSelection,
  startYear,
  label
}: IDateSelectorProps) => {
  const yearRange = getNumberRange(startYear || 1970, 100);
  const monthRange = getNumberRange(1, 12);

  const hourRange = getNumberRange(0, 23);
  const minuteRange = getNumberRange(0, 59);

  const [initDatePart, initTimePart] = (initDate || new Date())
    .toISOString()
    .split("T");
  const [initYear, initMonth, initDay] = initDatePart.split("-");
  const [initHour, initMinute] = initTimePart.split(".")[0].split(":");

  const [day, setDay] = useState<number | null>(Number(initDay));
  const [month, setMonth] = useState<number | null>(Number(initMonth));
  const [year, setYear] = useState<number | null>(Number(initYear));
  const [hour, setHour] = useState<number | null>(Number(initHour));
  const [minute, setMinute] = useState<number | null>(Number(initMinute));

  const [dayRange, setDayRange] = useState<number[]>([]);

  const [openDateSelectorOverlay, setOpenDateSelectorOverlay] = useState(false);
  const [openYearRange, setOpenYearRange] = useState(false);
  const [openMonthRange, setOpenMonthRange] = useState(false);
  const [openDayRnge, setOpenDayRange] = useState(false);
  const [openHourRange, setOpenHourRange] = useState(false);
  const [openMinuteRange, setOpenMinuteRange] = useState(false);

  const saveDate = () => {
    const dateString = `${year}-${month?.toString().padStart(2, "0")}-${day
      ?.toString()
      .padStart(2, "0")}T${hour?.toString().padStart(2, "0")}:${minute
      ?.toString()
      .padStart(2, "0")}:00.000Z`;
    onSelection(new Date(dateString));
    setOpenDateSelectorOverlay(false);
  };

  const unset = () => {
    setOpenDateSelectorOverlay(false);
  };

  const getDayRange = (month: number): number[] => {
    const isLeapYear = Number(year) % 4 === 0;
    let dayRangeLength = 31;
    if (month === 2) {
      dayRangeLength = isLeapYear ? 29 : 28;
    } else if ([4, 6, 9, 11].includes(month as number)) {
      dayRangeLength = 30;
    }
    console.log("day length", dayRangeLength, "and month", month);
    return getNumberRange(1, dayRangeLength);
  };

  return (
    <div>
      <div
        role="button"
        aria-haspopup={true}
        aria-expanded={openDateSelectorOverlay}
        onClick={() => setOpenDateSelectorOverlay(!openDateSelectorOverlay)}
      >
        <IonItem>
          <IonAvatar>
            <IonIcon icon={calendarSharp} size="large"></IonIcon>
          </IonAvatar>
          <IonLabel>
            <h3>{year}.{month?.toString().padStart(2,"0")}.{day?.toString().padStart(2, "0")} <IonIcon icon={timeSharp}></IonIcon> {hour?.toString().padStart(2, "0")}:{minute?.toString().padStart(2, "0")}</h3>
            <h6>Click to select date and / or time</h6>
          </IonLabel>
        </IonItem>
      </div>
      <IonModal
        isOpen={openDateSelectorOverlay}
        onDidDismiss={() => setOpenDateSelectorOverlay(false)}
      >
        <IonContent>
          <IonGrid>
            <IonRow>
              <IonCol size="12">
                <h4><IonIcon icon={calendarOutline}></IonIcon> Select Date </h4>
              </IonCol>
              <IonCol size="4">
                <div
                  className="ion-col"
                  role="button"
                  aria-label="show / hide year selection list"
                  onClick={() => setOpenYearRange(!openYearRange)}
                >
                  {`${year?.toString().padStart(2, "0")}`} <br/> Year
                </div>
                <div style={{ overflow: "auto" }}>
                  {openYearRange &&
                    yearRange.map((iten, index) => (
                      <div
                        key={index}
                        role="button"
                        onClick={() => {
                          setYear(iten);
                          setOpenYearRange(false);
                        }}
                        aria-label="select year"
                      >
                        {iten}
                      </div>
                    ))}
                </div>
              </IonCol>
              {/* end year flex item */}

              {/* start month flex item */}
              <IonCol size="4">
                <div
                  className="ion-col"
                  role="button"
                  aria-label="show / hide month selection list"
                  onClick={() => setOpenMonthRange(!openMonthRange)}
                >
                  {`${month?.toString().padStart(2, "0")}`} <br/> Month
                </div>
                {openMonthRange &&
                  monthRange.map((iten, index) => (
                    <div
                      key={index}
                      role="button"
                      onClick={() => {
                        setMonth(iten);
                        setDayRange(getDayRange(iten));
                        setOpenMonthRange(false);
                      }}
                      aria-label="select month"
                    >
                      {iten.toString().padStart(2, "0")}
                    </div>
                  ))}
              </IonCol>
              {/* end month flex item */}

              {/* start month flex item */}
              <IonCol size="4">
                <div
                  className="ion-col"
                  role="button"
                  aria-label="show / hide day selection list"
                  onClick={() => setOpenDayRange(!openDayRnge)}
                >
                  {`${day?.toString().padStart(2, "0")}`} <br/> Day
                </div>
                <div style={{ overflow: "auto" }}>
                  {openDayRnge &&
                    dayRange.map((iten, index) => (
                      <div
                        key={index}
                        role="button"
                        onClick={() => {
                          setDay(iten);
                          setOpenDayRange(false);
                        }}
                        aria-label="select day"
                      >
                        {iten.toString().padStart(2, "0")}
                      </div>
                    ))}
                </div>
              </IonCol>
              {/* end month flex item */}
            </IonRow>

            <IonRow>
              <IonCol size="12">
                <h4><IonIcon icon={timeOutline}></IonIcon> Select Time </h4>
              </IonCol>
              {/* start month flex item */}
              <IonCol size="3">
                <div
                  className="ion-col"
                  role="button"
                  aria-label="show / hide hour selection list"
                  onClick={() => setOpenHourRange(!openHourRange)}
                >
                  {`${hour?.toString().padStart(2, "0")}`} <br/> Hour
                </div>
                {openHourRange &&
                  hourRange.map((iten, index) => (
                    <div
                      key={index}
                      role="button"
                      onClick={() => {
                        setHour(iten);
                        setOpenHourRange(false);
                      }}
                      aria-label="select hour"
                    >
                      {iten.toString().padStart(2, "0")}
                    </div>
                  ))}
              </IonCol>
              {/* end hour flex item */}

              {/* start month flex item */}
              <IonCol size="3">
                <div
                  className="ion-col"
                  role="button"
                  aria-label="show / hide month selection list"
                  onClick={() => setOpenMinuteRange(!openMinuteRange)}
                >
                  {`${minute?.toString().padStart(2, "0")}`} <br/> Min
                </div>
                {openMinuteRange &&
                  minuteRange.map((iten, index) => (
                    <div
                      key={index}
                      role="button"
                      onClick={() => {
                        setMinute(iten);
                        setOpenMinuteRange(false);
                      }}
                      aria-label="select minute"
                    >
                      {iten.toString().padStart(2, "0")}
                    </div>
                  ))}
              </IonCol>
              {/* end hour flex item */}
            </IonRow>

            <IonRow>
              <IonCol size="12">
                <IonItem>
                  {["save", "cancel"].map((item, index) => (
                    <span
                      key={index}
                      className="ion-margin"
                      slot="end"
                      role="button"
                      onClick={() => {
                        if (item === "save") saveDate();
                        else unset();
                      }}
                    >
                      {item}
                    </span>
                  ))}
                </IonItem>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonContent>{" "}
      </IonModal>
    </div>
  );
};
