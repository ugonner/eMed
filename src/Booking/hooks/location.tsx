import { Geolocation, PermissionStatus } from "@capacitor/geolocation";
import { useAsyncHelpersContext } from "../../shared/contexts/async-helpers";
import { ILocationCord } from "../components/LocationVisualizer";
import { ILocationAddress } from "../../aid-service/dtos/aid-service-profile.dto";
import { AndroidSettings, IOSSettings, NativeSettings } from "capacitor-native-settings";
import { isPlatform, useIonAlert } from "@ionic/react";
import { IOpenStreetReverseGeoCode } from "../../aid-service/interfaces/location-geocode";

export interface IUseGeoLocationStore {
    getGeoCodeReverse: (dto: ILocationCord) => Promise<ILocationAddress | null>;
    getLocationCords: () => Promise<ILocationCord & {accuracy: number} | null>;
}

export const useGeoLocationStore = (): IUseGeoLocationStore => {
    const {setLoading, handleAsyncError} = useAsyncHelpersContext();
    const [presentAlert] = useIonAlert();
    const openAppSettings = async () => {
        try{

        if(isPlatform("android")) await NativeSettings.openAndroid({option: AndroidSettings.ApplicationDetails});
        else if(isPlatform("ios")) await NativeSettings.openIOS({option: IOSSettings.App});
        else alert("Can not automatically open your app settings, do this manually in your device settings");
        }catch(error){
         console.log("Error opening app settings for locaion permission", (error as Error).message)
         alert("Can not automatically open your app settings, do this manually in your device settings");
        }
    }

      const getGeoCodeReverse = async (dto: ILocationCord): Promise<ILocationAddress | null> => {
        try{
          const {latitude, longitude} = dto;
          setLoading({isLoading: true, loadingMessage: "getting your location"});
          const resBody = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`)
          if(!resBody.ok) throw new Error("Error fetching data");
          const res: IOpenStreetReverseGeoCode = await resBody.json();
          const {address: {road, residential, street, city, village, town, state_district, county, state, country}, lat, lon} = res;
          return ({
            longitude: Number(lon),
            latitude: Number(lat),
            street: road || residential || street,
            city: city || village || town,
            locality: county || state_district,
            state,
            country
          });
    
          setLoading({isLoading: false, loadingMessage: ""})
        }catch(error){
          handleAsyncError(error, "Error getting user geocode reverse");
          return null;
        }
      };

      const getLocationCords = async (): Promise<ILocationCord & {accuracy: number} | null> => {
        let perm: PermissionStatus;
        try{
            perm = await Geolocation.checkPermissions();
       
            if(perm.location !== "granted") await Geolocation.requestPermissions();
            const pos = await Geolocation.getCurrentPosition({enableHighAccuracy: true});
            return {
                latitude: pos.coords.latitude,
                longitude: pos.coords.longitude,
                accuracy: pos.coords.accuracy
            }
        }catch(error){
            presentAlert({
                header: "Permission Issue",
                message: "Location Permission is required, Please go to app settings and allow location permission for this app",
                buttons: [
                    {
                        text: "App Settings",
                        handler: openAppSettings,
                        role: "destructive"
                    },
                    {
                        text: "Cancel",
                        role: "cancel"
                    }
                ]
            });
            return null
        }
      }

      return {
        getGeoCodeReverse,
        getLocationCords
      }
}