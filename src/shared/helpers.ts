import { useIonToast } from "@ionic/react";


export const isObjectEmpty = (obj: object) => Object.keys(obj).length === 0;

export interface IUsePresentToastResult {
  presentToast: (message: string, duration?: number) => void;
  dismissToast: Function
}

export const  usePresentToast = (): IUsePresentToastResult => {
  const [presentToastMessage, dismissToast] = useIonToast();
  const presentToast = (message: string, duration = 4000) => {
    presentToastMessage({ message, duration, position: "bottom", color: "dark" })
  }
  return {
    presentToast, dismissToast
  }
}

export const formatCamelCaseToSentence = (camelCasedString: string): string => {
  let str = "";
  for (let i = 0; i < camelCasedString.length; i++) {
    let char = camelCasedString[i];
    char = isUpperCase(char) ? ` ${char}` : `${char}`;
    str += char;
  }
  return `${str[0]?.toUpperCase()}${str.slice(1)}`;
};

function isUpperCase(char: string) {
  return char === char.toUpperCase() && char !== char.toLowerCase();
}

export const concatArrayBuffers = (buffers: ArrayBuffer[]) => {
  const totalLength = buffers.reduce((sum, buf) => sum + buf.byteLength, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;
  buffers.forEach((buf) => {
    result.set(new Uint8Array(buf), offset);
    offset += buf.byteLength;
  });
  return result.buffer;
};
export const formatDate = (dateString: string): string => {
  let formattedDateTime = "";
  try {
    if (!dateString) return formattedDateTime;
    const date = new Date(dateString);
    if (!date) return formattedDateTime;

    const locale = "en-us";
    const [datePart, timePart] = dateString.split("T");
    const todayDatePart = new Date().toISOString().split("T")[0];

    if (
      Number(todayDatePart.split("-")[0]) !== Number(datePart.split("-")[0])
    ) {
      const dateStr = date.toLocaleDateString(locale, {
        year: "numeric",
        month: "short",
        day: "2-digit",
      });
      return `${dateStr} ${timePart.split(".")[0]}`;
    }

    if (
      Number(todayDatePart.split("-")[1]) !== Number(datePart.split("-")[1])
    ) {
      const dateStr = date.toLocaleDateString(locale, {
        month: "short",
        day: "2-digit",
      });
      return `${dateStr} ${timePart.split(".")[0]}`;
    }

    if (todayDatePart === datePart) {
      return `Today ${timePart.split(".")[0]}`;
    }
    if (
      Number(todayDatePart.split("-")[2]) - Number(datePart.split("-")[2]) ===
      0
    ) {
      return `Yesterday ${timePart.split(".")[0]}`;
    }
    if (
      Number(todayDatePart.split("-")[2]) - Number(datePart.split("-")[2]) <=
      7
    ) {
      const weekDay = date.toLocaleDateString(locale, {
        weekday: "long",
      });
      return `${weekDay} ${timePart.split(".")[0]}`;
    }

    return formattedDateTime;
  } catch (error) {
    console.log("Error formating date string", (error as Error).message);
    return formattedDateTime;
  }
};
