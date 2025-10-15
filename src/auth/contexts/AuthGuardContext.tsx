import { IonModal, IonPopover, useIonRouter } from "@ionic/react";
import { createContext, Dispatch, SetStateAction, useContext, useEffect, useState } from "react";
import { LocalStorageEnum } from "../../shared/enums";
import { IAuthUserProfile } from "../../user/interfaces/user";
import { AuthRoutes } from "../enums/routes";

export interface IAuthContextProps {
    isLoggedIn: boolean;
    setIsLoggedIn: SetStateAction<Dispatch<boolean>>;
    openAuthModal: boolean;
    setOpenAuthModal: SetStateAction<Dispatch<boolean>>;
    isAdmin: boolean;
    logOutUser: () => void;
}

const AuthGuardContext = createContext<IAuthContextProps>({} as IAuthContextProps);
export const AuthGuardContextProvider = ({children}: React.PropsWithChildren) => {
    const router = useIonRouter();

    const localAuthUser = localStorage.getItem(LocalStorageEnum.USER);
    const user: IAuthUserProfile | null = localAuthUser != undefined ? JSON.parse(localAuthUser) : null;
    
    const [isLoggedIn, setIsLoggedIn] = useState( user ? true : false);
    const [isAdmin, setIsAdmin] = useState((user?.role?.id && (user?.role?.id > 1)) ? true : false);

    const [openAuthModal, setOpenAuthModal] = useState(false);
    const logOutUser = () => {
      localStorage.clear();
        setIsLoggedIn(false);
        setIsAdmin(false);
        router.push(AuthRoutes.LOGIN);
    }
    

    const initAuthContextProps: IAuthContextProps = {
        isLoggedIn,
        setIsLoggedIn,
        openAuthModal,
        setOpenAuthModal,
        isAdmin,
        logOutUser
    };

  return (
    <AuthGuardContext.Provider value={initAuthContextProps}>
        {children}
        
    </AuthGuardContext.Provider>
  )
}
export const useAuthGuardContextStore = () => useContext(AuthGuardContext);
