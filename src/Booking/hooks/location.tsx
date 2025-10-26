import {
  Geolocation,
  Position
} from "@capacitor/geolocation";
import { useAsyncHelpersContext } from "../../shared/contexts/async-helpers";
import { ILocationCord } from "../components/LocationVisualizer";
import { ILocationAddress } from "../../aid-service/dtos/aid-service-profile.dto";
import { isPlatform, useIonAlert } from "@ionic/react";
import { IOpenStreetReverseGeoCode } from "../../aid-service/interfaces/location-geocode";
import { App } from "@capacitor/app";
import { Capacitor } from "@capacitor/core";
import { AndroidSettings, IOSSettings, NativeSettings } from "capacitor-native-settings";

export interface IUseGeoLocationStore {
  getGeoCodeReverse: (dto: ILocationCord) => Promise<ILocationAddress | null>;
  getLocationCords: () => Promise<
    (ILocationCord & { accuracy: number }) | null
  >;
}

export const useGeoLocationStore = (): IUseGeoLocationStore => {
  const { setLoading, handleAsyncError } = useAsyncHelpersContext();
  const [presentAlert] = useIonAlert();
  const openAppSettings = async () => {
    try {
      if(Capacitor.isNativePlatform()){
        if(isPlatform("android")) NativeSettings.openAndroid({option: AndroidSettings.Application});
        if(isPlatform("ios")) NativeSettings.openIOS({option: IOSSettings.App});
      }
      else presentAlert({
          message:
            "Can not automatically open your app settings, do this manually in your device settings",
          buttons: [
            {
              text: "Ok",
              role: "cancel",
            },
          ],
        });
    } catch (error) {
      console.log("Error opening app settings", (error as Error).message);
    }
  };

  const getGeoCodeReverse = async (
    dto: ILocationCord
  ): Promise<ILocationAddress | null> => {
    try {
      const { latitude, longitude } = dto;
      setLoading({ isLoading: true, loadingMessage: "getting your location" });
      const resBody = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
      );
      if (!resBody.ok) throw new Error("Error fetching data");
      const res: IOpenStreetReverseGeoCode = await resBody.json();
      const {
        address: {
          road,
          residential,
          street,
          city,
          village,
          town,
          state_district,
          county,
          state,
          country,
        },
        lat,
        lon,
      } = res;
      return {
        longitude: Number(lon),
        latitude: Number(lat),
        street: road || residential || street,
        city: village || town || city,
        locality: county || state_district,
        state,
        country,
      };

      setLoading({ isLoading: false, loadingMessage: "" });
    } catch (error) {
      handleAsyncError(error, "Error getting user geocode reverse");
      return null;
    }
  };

  const getLocationCords = async (): Promise<
    (ILocationCord & { accuracy: number }) | null
  > => {
    try {
      const perm = await Geolocation.checkPermissions();
      
      if (Capacitor.isNativePlatform() && perm.location !== "granted")
        await Geolocation.requestPermissions();

      const pos: Position | GeolocationPosition = Capacitor.isNativePlatform()
        ? await Geolocation.getCurrentPosition({ enableHighAccuracy: true })
        : await Geolocation.getCurrentPosition();

      return {
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
        accuracy: pos.coords.accuracy,
      };
    } catch (error) {
      presentAlert({
        header: "Location Issue",
        message: `Error: ${
          (error as Error).message
        } Or You are porbably facing permission issue, You can grant this permission in your app settings`,
        buttons: [
          {
            text: "App Settings",
            handler: () => {
              openAppSettings();
              return true;
            },
            role: "destructive",
          },
          {
            text: "Cancel",
            role: "cancel",
          },
        ],
      });
      return null;
    }
  };

  return {
    getGeoCodeReverse,
    getLocationCords,
  };
};
