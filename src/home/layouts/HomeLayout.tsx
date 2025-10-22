import { IonContent, IonPage, IonRouterOutlet } from "@ionic/react"
import { Redirect, Route } from "react-router"
import { HomeRoutes } from "../enums/routes"
import { AuthGuard } from "../../auth/guards/AuthGuard"
import { HomePage } from "../pages/HomePage"
import { BaseHeader } from "../../shared/components/partials/BaseHeader"
import { NavigationBarGap } from "../../shared/components/partials/NavigationBarGap"

export const HomeLayout = () => {
    return (
         <AuthGuard>
              <IonPage>
                <BaseHeader title="Service Connect" />
                <IonContent id="base-menu-content">
                  <IonRouterOutlet>
                    <Route path={HomeRoutes.HOME} component={HomePage} />
                  </IonRouterOutlet>
                  <NavigationBarGap />
            </IonContent>
            </IonPage>
        </AuthGuard>
    )
}