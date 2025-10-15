import { PropsWithChildren, useEffect } from "react";
import { LocalStorageEnum } from "../../shared/enums";
import { useIonRouter } from "@ionic/react";
import { AuthRoutes } from "../enums/routes";
import { IAuthUserProfile } from "../../user/interfaces/user";
import { usePresentToast } from "../../utils";

export interface IRoleGuardProps extends PropsWithChildren {
    role: "user" | "admin";
}
export const RoleGuard = ({role, children}: IRoleGuardProps) => {
    const router = useIonRouter();
    const {presentToastMessage} = usePresentToast();

    
        const userString = localStorage.getItem(LocalStorageEnum.USER);
        if((!userString) || (userString == undefined)) {
            router.push(`${AuthRoutes.LOGIN}`);
            return;
        }
        const authUser: IAuthUserProfile = JSON.parse(userString as string);
        if(role === "admin" && /admin/i.test(authUser.role?.name || "")) {
            presentToastMessage("Only admins can access this page");
            router.push(AuthRoutes.LOGIN);
            return;
        }

    return (
        <>
          {children}
        </>
    )
}