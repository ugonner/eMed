import { useEffect, useState } from "react"
import { APIBaseURL, postData } from "../../shared/api/base";
import { ellipsisVertical } from "ionicons/icons";
import { RoleDTO } from "../../auth/dtos/role.dto";
import { IAuthUserProfile, IProfile } from "../interfaces/user";
import { useAsyncHelpersContext } from "../../shared/contexts/async-helpers";
import { IonAvatar, IonButton, IonCol, IonContent, IonHeader, IonIcon, IonImg, IonItem, IonLabel, IonList, IonModal, IonPopover, IonTitle } from "@ionic/react";
import { defaultUserImageUrl } from "../../shared/DATASETS/defaults";
import { useIInitContextStore } from "../../shared/contexts/InitContextProvider";
import { UserMenu } from "./UserMenu";

export interface IUserCardProps {
    user: IProfile;
    userRole?: RoleDTO;
    showMenu?: boolean;

}

export const UserCard = ({user, userRole, showMenu}: IUserCardProps) => {

    
    
    return (
        <>
        <IonCol size={showMenu ? "11" : "12"}>
            <IonItem>
                <IonAvatar>
                    <IonImg src={user?.avatar || defaultUserImageUrl} alt={user.firstName}></IonImg>
                </IonAvatar>
                <IonLabel className="ion-margin">
                    <p>{user.firstName}, {user.lastName}</p>
                    <p>
                        <small>{user.email}</small>
                        <small>{user.phoneNumber}</small>
                    </p>
                         <p>{
                user?.profileClusters?.map((pCltr, index) => (
                    <span key={index} className="ion-margin-horizontal">{pCltr?.cluster?.name}</span>
                ))
                }</p>
                <small>Role: {userRole?.name || "Member"}</small>
                </IonLabel>
            </IonItem>
        </IonCol>
        {
            showMenu && (
                <IonCol size="1">
                    <UserMenu user={user} />
                </IonCol>
            )
        }
       
       
        </>
    )
}