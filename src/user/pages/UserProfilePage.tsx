import { useLocation } from "react-router"
import { getLocalUser, useLocalStorage } from "../../utils";
import { useEffect, useState } from "react";
import { IProfile } from "../interfaces/user";
import { APIBaseURL, getData } from "../../shared/api/base";
import { IonButton, IonContent, IonGrid, IonHeader, IonModal, IonTitle } from "@ionic/react";
import { UserProfile } from "../components/UserProfile";
import { IProfileWallet } from "../interfaces/user-wallet";
import { ManageUserClusters } from "../components/cluster/ManageUserClusters";
import { LocalStorageEnum } from "../../shared/enums";
import { IAppSettings } from "../../shared/interfaces/app-settings";
import { useAsyncHelpersContext } from "../../shared/contexts/async-helpers";

export const UserProfilePage = () => {
   const {getItem, setItem} = useLocalStorage();
   const {setLoading, handleAsyncError} = useAsyncHelpersContext();

    const queryParams = new URLSearchParams(useLocation().search);
    const user = getItem<IProfile>(LocalStorageEnum.USER);
    const appSettings = getItem<IAppSettings>(LocalStorageEnum.APP_SETTINGS);

    const userId = queryParams.get("ui") || user?.userId;
    const isOwner = user?.userId === userId;

    const [profile, setProfile] = useState<IProfile>();
    const [profileWallet, setProfileWallet] = useState<IProfileWallet>();
    const [openClusterOverlay, setOpenClusterOverlay] = useState(false);


      
    const getProfile = async () => {
      try{
        setLoading({isLoading: true, loadingMessage: "fetching profile info"});
 const res = await getData<IProfile>(`${APIBaseURL}/user/${userId}`);
        setProfile(res);
        if((!appSettings) || ((!appSettings?.hideJoinClustersOverlay) && !res.profileClusters)) setOpenClusterOverlay(true);
     
        setLoading({isLoading: false, loadingMessage: ""})
      }catch(error){
        handleAsyncError(error, "Error getting user profile");
      }
    }

    const getUserWallet = async () => {
        try{
          setLoading({isLoading: true, loadingMessage: "fetching profile wallet"});
const res = await getData<IProfileWallet>(`${APIBaseURL}/transaction/wallet`);
        setProfileWallet(res);
          setLoading({isLoading: false, loadingMessage: ""})
        }catch(error){
          handleAsyncError(error, "Error fetching profile wallet")
        }
    }

    useEffect(() => {
        getProfile();
        if(isOwner) getUserWallet();
        
    }, [])

    return (
        <>
            <IonHeader>
                <IonTitle>Profile</IonTitle>
            </IonHeader>
            <IonContent>
                <IonGrid>
                    
                <UserProfile profile={profile || {} as IProfile} profileWallet={profileWallet} userId={userId as string} />
                </IonGrid>
                 <IonModal
          isOpen={openClusterOverlay}
          onDidDismiss={() => setOpenClusterOverlay(false)}
        >
          <IonContent>
            <ManageUserClusters
              user={profile || ({} as IProfile)}
              userClusters={profile?.profileClusters?.map(
                (userCluster) => userCluster.cluster
              )}
              onCompletion={() => {
                setOpenClusterOverlay(false);
               }}
            />
            <IonButton
              expand="full"
              fill="clear"
               onClick={() => setOpenClusterOverlay(false)}
              >
              Maybe Later
            </IonButton>
            <IonButton
              expand="full"
              fill="clear"
               onClick={() => {
                let appSettings = getItem<IAppSettings>(LocalStorageEnum.APP_SETTINGS);
                appSettings = {...(appSettings || {}), hideJoinClustersOverlay: true}
                setItem(LocalStorageEnum.APP_SETTINGS, appSettings)
                setOpenClusterOverlay(false)
               }}
              >
              Don't Show Again
            </IonButton>
          </IonContent>
        </IonModal>
            </IonContent>
        </>
    )
}