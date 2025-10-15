import { IonContent, IonPage, IonRouterOutlet } from "@ionic/react";
import { PropsWithChildren } from "react";
import { Route } from "react-router";
import { BookingRoutes } from "../enums/routes";
import { BookAidServicePage } from "../pages/BookAidServicePage";
import { InvoicePage } from "../pages/InvoicePage";
import { BookingPage } from "../pages/BookingPage";
import { BaseHeader } from "../../shared/components/partials/BaseHeader";
import { AuthGuard } from "../../auth/guards/AuthGuard";

export const BookingLayout = () => {
    return (
       <AuthGuard>
         <IonPage>
            <BaseHeader title="Booking" />
            <IonContent id="base-menu-content">
                
            <IonRouterOutlet>
                <Route path={BookingRoutes.BOOK_SERVICE} component={BookAidServicePage} />
                <Route path={BookingRoutes.INVOICE} component={InvoicePage} />
                <Route path={BookingRoutes.VIEW_BOOKING} component={BookingPage} />
            </IonRouterOutlet>
            </IonContent>
            
        </IonPage>
       </AuthGuard>
    )
}