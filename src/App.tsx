import { Redirect, Route, useHistory } from "react-router-dom";
import { IonApp, IonRouterOutlet, setupIonicReact } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import "@ionic/react/css/palettes/dark.system.css";

/* Theme variables */
import "./theme/variables.css";
import { AsyncHelperProvider } from "./shared/contexts/async-helpers";

import { PlainRTCBaseLayout } from "./call/layouts/PlainRTCBaseLayout";
import { PlainRTCContextProvider } from "./call/contexts/plainwebrtc";
import { AuthGuardContextProvider } from "./auth/contexts/AuthGuardContext";
import { AidServiceRoutes } from "./aid-service/enums/routes";
import { AidServiceLayout } from "./aid-service/layouts/AidServiceLayout";
import { InitContextProvider } from "./shared/contexts/InitContextProvider";
import { BookingRoutes } from "./Booking/enums/routes";
import { BookingLayout } from "./Booking/layouts/BookingLayout";
import { UserRoutes } from "./user/enums/routes.enum";
import { UserLayout } from "./user/layouts/UserLayout";
import { AdminRoutes } from "./admin/enums/routes";
import { AdminLayout } from "./admin/layouts/AdminLayout";
import { AuthRoutes } from "./auth/enums/routes";
import { AuthenticationsLayout } from "./auth/layouts/AuthenticationsLayout";
import { HomeRoutes } from "./home/enums/routes";
import { CallRoutes } from "./call/enums/routes";
import { BaseMenu } from "./shared/components/menus/BaseMenu";
import { PaymetRoutes } from "./payment/enums/routes";
import { PaymentLayout } from "./payment/layouts/PaymentLayout";
import { AdminMenu } from "./shared/components/menus/AdminMenu";
import { VerifyPayment } from "./payment/Components/VerifyPayment";
import { VerifyPaymentCallbackPage } from "./payment/pages/VerifyPaymentCalllbackPage";
import { BaseLayout } from "./shared/layouts/BaseLayout";
import { TransactionsPage } from "./payment/pages/TransactionsPage";

setupIonicReact();
const App: React.FC = () => {
  return (
    <IonApp>
      <AsyncHelperProvider>
        <InitContextProvider>
          <AuthGuardContextProvider>
            <PlainRTCContextProvider>
              <BaseLayout>
                
              <BaseMenu />
              <AdminMenu />
              <IonReactRouter>
                <IonRouterOutlet>
                  <Route path={CallRoutes.HOME} component={PlainRTCBaseLayout} />
                  <Route
                    path={AidServiceRoutes.HOME}
                    component={AidServiceLayout}
                  />
                  <Route path={BookingRoutes.HOME} component={BookingLayout} />
                  <Route path={UserRoutes.HOME} component={UserLayout} />
                  <Route path={AdminRoutes.HOME} component={AdminLayout} />
                  <Route path={AuthRoutes.HOME} component={AuthenticationsLayout} />
                  
                    <Route exact={false} path={PaymetRoutes.VERIFY_PAYMENT} component={VerifyPaymentCallbackPage} />
                     <Route path={PaymetRoutes.TRANSACTIONS} component={TransactionsPage} />
                            
                    <Redirect to={CallRoutes.HOME} />
                  
                </IonRouterOutlet>
              </IonReactRouter>
              </BaseLayout>
            </PlainRTCContextProvider>
          </AuthGuardContextProvider>
        </InitContextProvider>
      </AsyncHelperProvider>
    </IonApp>
  );
};

export default App;
