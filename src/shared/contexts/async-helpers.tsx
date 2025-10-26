import { IonLoading, IonModal } from "@ionic/react";
import React, { createContext, Dispatch, SetStateAction, useContext, useState } from "react";
import { Loader } from "../components/Loader";
import { usePresentToast } from "../../utils";

export interface ILoadingProps {
    isLoading: boolean;
    loadingMessage: string;
}

export interface IErrorProps {
    isError: boolean;
    errorMessage: string;
    errorDismissal?: Function
}

export interface IAsyncProps {
    loading: ILoadingProps
    setLoading: Dispatch<SetStateAction<ILoadingProps>>;
    error: IErrorProps;
    setError: Dispatch<SetStateAction<IErrorProps>>;
    handleAsyncError: (error: unknown, msg?: string) => void;
}

const AsyncContext: React.Context<IAsyncProps> = createContext({} as IAsyncProps);

export const AsyncHelperProvider = ({children}: React.PropsWithChildren) => {
    const {presentToastMessage} = usePresentToast();

    const [loading, setLoading] = useState<ILoadingProps>({isLoading: false, loadingMessage: ""});
    const [error, setError] = useState<IErrorProps>({isError: false, errorMessage: ""});
    
    const handleAsyncError = (error: unknown, msg?: string) => {
        console.log(msg, (error as Error).message);
        const errMessage = (error as Error).message;
        const outputMsg = /fetch/i.test(errMessage) || /time(\s)?out/i.test(errMessage) ? "Bad Network Connectivity" : `${msg}: ${errMessage}`;
        presentToastMessage(outputMsg)
    }

    const initAsyncHelperProps: IAsyncProps = {
        error,
        setError,
        loading,
        setLoading,
        handleAsyncError
        
    };

    return (
        <AsyncContext.Provider value={initAsyncHelperProps}>
            <div>
                <Loader />
            </div>
            {children}
            
                <IonLoading isOpen={loading.isLoading} onDidDismiss={() => setLoading({loadingMessage: "", isLoading: false})} message={loading.loadingMessage} duration={5000} backdropDismiss={true}></IonLoading>
            
        </AsyncContext.Provider>
    )
}

export const useAsyncHelpersContext = () => useContext(AsyncContext);
