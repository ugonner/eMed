import { useIonToast } from "@ionic/react";
import { useRef } from "react";
import { IAuthUserProfile, IProfile } from "../user/interfaces/user";
import { LocalStorageEnum } from "../shared/enums";

export interface IUsePresentToastResult {
  presentToastMessage: (
    message: string,
    color?: string,
    duration?: number
  ) => void;
  dismissToast: Function;
}

export const usePresentToast = (): IUsePresentToastResult => {
  const [presentToast, dismissToast] = useIonToast();
  const presentToastMessage = (
    message: string,
    color = "dark",
    duration = 5000
  ) => {
    presentToast({
      message,
      color,
      duration,
    }).catch((err) => console.log("Error presenting toast", err.message));
  };
  return {
    presentToastMessage,
    dismissToast,
  };
};

export interface IUseAudioPlay {
  playAudio: (src: string, loop?: boolean) => Promise<void>;
  stopAudio: () => Promise<void>;
}
export const useAudioPlay = (): IUseAudioPlay => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const playAudio = async (audioPath: string, loop = true) => {
    try {
      if (audioRef.current) await stopAudio();

      const audio = new Audio(audioPath);
      audio.loop = loop;

      audioRef.current = audio;
      await audioRef.current.play();
    } catch (error) {
      console.log("Error playing sound", (error as Error).message);
    }
  };

  const stopAudio = async () => {
    try {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    } catch (error) {
      console.log("Error stopping sound", (error as Error).message);
    }
  };
  return { stopAudio, playAudio };
};

export function getDuration(startTime: number, endTime: number): string {
  if (!startTime || !endTime) return "00:00:00";
  const durationMs = Number(endTime) - Number(startTime);
  const totalSeconds = Math.floor(durationMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${hours}:${minutes}:${seconds}`;
}

export const getLocalUser = (): IProfile | null => {
  try {
    const localUser = localStorage.getItem(LocalStorageEnum.USER);
    const user: IAuthUserProfile | null =
      localUser == undefined ? null : JSON.parse(localUser);
    return user?.profile as IProfile;
  } catch (error) {
    console.log("Error getting local user", (error as Error).message);
    return null;
  }
};

export function formatCurrency(
  amount: number,
  currency = "NGN",
  locale = "en-US"
) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(amount || 0);
}

export interface IUseLocalStorage {
  getItem: <TItem>(key: LocalStorageEnum) => TItem | null;
  setItem: (key: LocalStorageEnum, itemObj: unknown) => void;
}

export const useLocalStorage = (): IUseLocalStorage => {
  function getItem<TItem>(key: LocalStorageEnum): TItem | null {
    const itemString = localStorage.getItem(key);
    if (!itemString || itemString == undefined) return null;
    return JSON.parse(itemString) as TItem;
  }

  const setItem = (key: LocalStorageEnum, tObj: unknown) => {
    const tString = JSON.stringify(tObj);
    localStorage.setItem(key, tString);
  }

  return { getItem, setItem };
};

export function formatObjectToReadableText(obj: any): string {
  if (obj == null) return "No data";
  if (typeof obj !== "object") return String(obj);

  return Object.entries(obj)
    .map(([key, value]) => {
      const label = key.charAt(0).toUpperCase() + key.slice(1);
      if (typeof value === "object" && value !== null) {
        return `${label}: (${formatObjectToReadableText(value)})`;
      }
      return `${label}: ${value}`;
    })
    .join(", ");
}

export const sendWhatsappMessage = (phoneNumber: string, message: string) => {
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.location.href = url;
  }

