import {
  IonCol,
  IonContent,
  IonGrid,
  IonPage,
  IonRouterOutlet,
  IonRow,
} from "@ionic/react";
import { BaseHeader } from "../../shared/components/partials/BaseHeader";
import { Route } from "react-router";
import { PaymetRoutes } from "../enums/routes";
import { VerifyPaymentPage } from "../pages/VerifyPaymentPage";
import { ServiceTransactions } from "../Components/ServiceTransactions";

export const PaymentLayout = () => {
  return (
    <IonPage>
      <BaseHeader title="Payment Transaction" />
      <IonContent id="base-menu-content">
         <IonRouterOutlet>
                <Route
                  path={PaymetRoutes.TRANSACTIONS}
                  component={ServiceTransactions}
                />{" "}
              </IonRouterOutlet>
      </IonContent>
    </IonPage>
  );
};
