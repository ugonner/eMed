import { IonContent, IonPage, IonRouterOutlet } from "@ionic/react"
import { Route } from "react-router"
import { AuthRoutes } from "../enums/routes"
import { LoginOrRegister } from "../components/LoginOrRegister"
import { ChangePassword } from "../components/ChangePassword"
import { ResetPassword } from "../components/ResetPassword"
import { OTPHandler } from "../components/OTPHandler"

export const AuthenticationsLayout = () => {
    return (
        <IonPage>
            <IonContent>
                
            <IonRouterOutlet>
                <Route path={AuthRoutes.HOME} component={LoginOrRegister} />
                <Route path={AuthRoutes.LOGIN} component={LoginOrRegister} />
                <Route path={AuthRoutes.CHANGE_PASSWORD} component={ChangePassword} />
                <Route path={AuthRoutes.RESET_PASSWORD} component={ResetPassword} />
                <Route path={AuthRoutes.VERIFY_OTP} component={OTPHandler} />
            </IonRouterOutlet>
            </IonContent>
        </IonPage>
    )
}