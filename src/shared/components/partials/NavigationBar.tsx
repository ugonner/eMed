import {
  calendarOutline,
  calendarSharp,
  home,
  homeOutline,
  homeSharp,
  listOutline,
  listSharp,
  personOutline,
  personSharp,
} from "ionicons/icons";
import { IQuickLinkItem } from "../../../home/interfaces/hone";
import { HomeRoutes } from "../../../home/enums/routes";
import { BookingRoutes } from "../../../Booking/enums/routes";
import { UserRoutes } from "../../../user/enums/routes.enum";
import {
  IonIcon,
  IonLabel,
  IonTab,
  IonTabBar,
  IonTabButton,
  IonTabs,
  useIonRouter,
} from "@ionic/react";
import { useLocation } from "react-router";
import { AidServiceRoutes } from "../../../aid-service/enums/routes";
import { AuthRoutes } from "../../../auth/enums/routes";
export interface INavigationItem {
  text: string;
  activeIcon: string;
  inactiveIcon: string;
  pathDomain: string;
  routeLink: string;
}

export const NavigationBar = () => {
  const router = useIonRouter();
  const { pathname } = useLocation();

  const navItems: INavigationItem[] = [
    {
      text: "home",
      activeIcon: homeSharp,
      inactiveIcon: homeOutline,
      pathDomain: "/home",
      routeLink: `${HomeRoutes.HOME}`,
    },
    {
      text: "My Bookings",
      inactiveIcon: calendarOutline,
      activeIcon: calendarSharp,
      pathDomain: "/booking",
      routeLink: `${BookingRoutes.USER_BOOKINGS}`,
    },
    {
      text: "My Profile",
      inactiveIcon: personOutline,
      activeIcon: personSharp,
      pathDomain: "/user",
      routeLink: `${UserRoutes.PROFILE}`,
    },
    {
      text: "Services",
      activeIcon: listSharp,
      inactiveIcon: listOutline,
      pathDomain: "/aid-service",
      routeLink: `${AidServiceRoutes.AID_SERVICE_ALL}`,
    },
  ];

  return (
    <>
      {new RegExp(HomeRoutes.SPLASH_PAGE, "i").test(pathname) ||
      new RegExp(HomeRoutes.ONBOARDING, "i").test(pathname) ||
      new RegExp(AuthRoutes.HOME, "i").test(pathname) ? (
        <div></div>
      ) : (
        <IonTabBar slot="bottom">
          {navItems.map((item, index) => (
            <IonTabButton
              key={index}
              tab={item.pathDomain}
              href={item.routeLink}
            >
              <IonIcon
                icon={
                  new RegExp(item.pathDomain, "i").test(pathname)
                    ? item.activeIcon
                    : item.inactiveIcon
                }
              />
              <IonLabel>{item.text}</IonLabel>
            </IonTabButton>
          ))}
        </IonTabBar>
      )}
    </>
  );
};
