import {
  calendarOutline,
  calendarSharp,
  home,
  homeOutline,
  homeSharp,
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
export interface INavigationItem {
  text: string;
  activeIcon: string;
  inactiveIcon: string;
  pathDomain: string;
  routeLink: string;
}

export const NavigationBar = () => {
  const router = useIonRouter();
  const {pathname} = useLocation();;

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
  ];

  return (
    <>
    
      <IonTabBar slot="bottom">
        {navItems.map((item, index) => (
          <IonTabButton key={index} tab={item.pathDomain} href={item.routeLink}>
            <IonIcon icon={ new RegExp(item.pathDomain, "i").test(pathname) ? item.activeIcon : item.inactiveIcon} />
            <IonLabel>{item.text}</IonLabel>
          </IonTabButton>
        ))}
      </IonTabBar>
    </>
  );
};
