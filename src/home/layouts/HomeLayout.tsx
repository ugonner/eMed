import { IonContent, IonPage, IonRouterOutlet } from "@ionic/react"
import { Redirect, Route } from "react-router"
import { HomeRoutes } from "../enums/routes"
import { AuthGuard } from "../../auth/guards/AuthGuard"
import { HomePage } from "../pages/HomePage"
import { BaseHeader } from "../../shared/components/partials/BaseHeader"
import { CallRoutes } from "../../call/enums/routes"

export const HomeLayout = () => {
    return (
        <AuthGuard>
            <IonRouterOutlet>
                <Redirect to={CallRoutes.HOME} />
            </IonRouterOutlet>
        </AuthGuard>
    )
}