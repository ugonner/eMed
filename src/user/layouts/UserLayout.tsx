import { IonContent, IonPage, IonRouterOutlet } from "@ionic/react"
import { Route } from "react-router"
import { UserRoutes } from "../enums/routes.enum"
import { UserProfilePage } from "../pages/UserProfilePage"
import { UserDashboard } from "../pages/UserDashboard"
import { ServiceClusters } from "../components/cluster/ServiceClusters"
import { BaseHeader } from "../../shared/components/partials/BaseHeader"
import { AuthGuard } from "../../auth/guards/AuthGuard"

export const UserLayout = () => {
    return (
        <AuthGuard>
            
        <IonPage>
           <BaseHeader title="Account" />
           <IonContent id="base-menu-content">
             <IonRouterOutlet>
                <Route path={UserRoutes.HOME} component={UserProfilePage} />
                <Route path={UserRoutes.PROFILE} component={UserProfilePage} />
                <Route path={UserRoutes.DASHBOARD} component={UserDashboard} />
                <Route path={UserRoutes.CLUSTER_DASHBOARD} component={ServiceClusters} />
            </IonRouterOutlet>
           </IonContent>
        </IonPage>
        </AuthGuard>
    )
}