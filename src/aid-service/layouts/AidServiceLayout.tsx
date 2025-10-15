import { IonContent, IonPage, IonRouterOutlet } from "@ionic/react";
import { PropsWithChildren } from "react";
import { Route } from "react-router";
import { AidServiceRoutes } from "../enums/routes";
import { ProfileApplicationPage } from "../pages/ProfileApplicationPage";
import { AidServicesPage } from "../pages/AidServicesPage";
import { AidServiceProfilePage } from "../pages/AidServiceProfilePage";
import { CreateAidServicePage } from "../pages/CreateAidServicePage";
import { AidServicePage } from "../pages/AidServicePage";
import { BaseHeader } from "../../shared/components/partials/BaseHeader";
import { AuthGuard } from "../../auth/guards/AuthGuard";

export const AidServiceLayout = () => {
    return (
        <AuthGuard>
            
        <IonPage>
            <BaseHeader title="Services"/>
            
        <IonContent id="base-menu-content">
            <IonRouterOutlet>
                <Route path={AidServiceRoutes.APPLY} component={ProfileApplicationPage} />
                <Route path={AidServiceRoutes.AID_SERVICE_PROFILE} component={AidServiceProfilePage} />
                <Route path={AidServiceRoutes.AID_SERVICE_ALL} component={AidServicesPage} />
                <Route path={AidServiceRoutes.AID_SERVICE_CREATE} component={CreateAidServicePage} />
                <Route path={AidServiceRoutes.AID_SERVICE_SINGLE} component={AidServicePage} />

            </IonRouterOutlet>
            
        </IonContent>
        </IonPage>
        </AuthGuard>
    )
}