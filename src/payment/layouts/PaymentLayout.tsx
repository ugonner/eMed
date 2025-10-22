import {
  IonContent,
  IonPage,
  IonRouterOutlet,
} from "@ionic/react";
import { BaseHeader } from "../../shared/components/partials/BaseHeader";
import { Route } from "react-router";
import { PaymetRoutes } from "../enums/routes";
import { ServiceTransactions } from "../Components/ServiceTransactions";
import { NavigationBarGap } from "../../shared/components/partials/NavigationBarGap";

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
              <NavigationBarGap />
      </IonContent>
    </IonPage>
  );
};
