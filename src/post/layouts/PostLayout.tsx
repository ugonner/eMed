import { IonContent, IonPage, IonRouterOutlet } from "@ionic/react"
import { Route } from "react-router"
import { AuthGuard } from "../../auth/guards/AuthGuard"
import { BaseHeader } from "../../shared/components/partials/BaseHeader"
import { PostRoutes } from "../enums/route"
import { PostDetailPage } from "../pages/PostDetailPage"
import { NavigationBarGap } from "../../shared/components/partials/NavigationBarGap"
import { BaseMenu } from "../../shared/components/menus/BaseMenu"

export const PostLayout = () => {
    return (
         <AuthGuard>
              <IonPage>
                <BaseHeader title="Health Education" />
                <IonContent id="base-menu-content">
                  <BaseMenu />
                  <IonRouterOutlet>
                    <Route path={PostRoutes.HOME} component={PostDetailPage} />
                    <Route path={PostRoutes.VIEW_POST} component={PostDetailPage} />
                  </IonRouterOutlet>
                  {/* <NavigationBarGap /> */}
            </IonContent>
            </IonPage>
        </AuthGuard>
    )
}