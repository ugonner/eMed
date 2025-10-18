import { IonContent, IonPage, IonRouterOutlet } from "@ionic/react";
import { Route } from "react-router";
import { AdminRoutes } from "../enums/routes";
import { AidServiceProfileDashboard } from "../../aid-service/components/Dashboard";
import { UserDashboard } from "../../user/pages/UserDashboard";
import { BookingDashboard } from "../../Booking/components/BookingDashboard";
import { ReportDashboard } from "../../report/components/ReportDashboard";
import { AdminDashboard } from "../pages/Dashboard";
import { AdminHeader } from "../../shared/components/partials/AdminHeader";
import { PaymentTransactionDashboard } from "../../payment/Components/TransactionDashboard";

export const AdminLayout = () => {
  return (
    <IonPage>
      <AdminHeader title="Admin Dashboard" />
      <IonContent id="admin-menu-content">
<IonRouterOutlet>
        <Route path={AdminRoutes.HOME} component={AdminDashboard} />
        <Route
          path={AdminRoutes.SERVICE_PROFILE}
          component={AidServiceProfileDashboard}
        />
        <Route path={AdminRoutes.USER} component={UserDashboard} />
        <Route path={AdminRoutes.BOOKING} component={BookingDashboard} />
        <Route path={AdminRoutes.REPORT} component={ReportDashboard} />
        <Route path={AdminRoutes.TRANSACTION} component={PaymentTransactionDashboard} />
      </IonRouterOutlet>
      </IonContent>
      
    </IonPage>
  );
};
