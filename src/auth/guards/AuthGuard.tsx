import { PropsWithChildren, useEffect } from "react";
import { LocalStorageEnum } from "../../shared/enums";
import { IonContent, IonPage, useIonRouter } from "@ionic/react";
import { AuthRoutes } from "../enums/routes";
import { LoginOrRegister } from "../components/LoginOrRegister";

export const AuthGuard = ({children}: PropsWithChildren) => {
    const router = useIonRouter();

        const userString = localStorage.getItem(LocalStorageEnum.USER);
        const isNotAuthed = ((!userString) || (userString == undefined));
        if(isNotAuthed) {
            router.push(`${AuthRoutes.LOGIN}`);
            return;
        }
    
    return (
        <>
        {children}
        </>
    )
}