import { useEffect, useRef, useState } from "react";
import { useAuthGuardContextStore } from "../../auth/contexts/AuthGuardContext";
import { useAsyncHelpersContext } from "../../shared/contexts/async-helpers";
import { getLocalUser } from "../../utils";
import { IProfile } from "../interfaces/user";
import { APIBaseURL, postData } from "../../shared/api/base";
import {
  IonButton,
  IonContent,
  IonIcon,
  IonItem,
  IonList,
  IonModal,
  IonPopover,
  useIonRouter,
} from "@ionic/react";
import { ellipsisVertical } from "ionicons/icons";
import { UpdateUserProfile } from "./UpdateUserProfile";
import { ManageUserRoles } from "./role/ManageUserRoles";
import { CreateReport } from "../../report/components/CreateReport";
import { ServiceType } from "../../review/enums/service";
import { ManageUserClusters } from "./cluster/ManageUserClusters";
import { UserMenuActions } from "../enums/user.enum";

export interface IUserMenuProps {
  user: IProfile;
  onCompletion?: () => void;
}

export const UserMenu = ({ user, onCompletion }: IUserMenuProps) => {
  const { setLoading, handleAsyncError } = useAsyncHelpersContext();
  const { isAdmin } = useAuthGuardContextStore();
  
  const actionsRef = useRef<UserMenuActions[]>([]);
  const currentActionRef = useRef<UserMenuActions>();
 
  const [openMenuOverlay, setOpenMenuOverlay] = useState(false);
  const [openActionOverlay, setOpenActionOverlay] = useState(false);

  const localUser = getLocalUser();
  const isOwner = localUser?.userId === user?.userId;

  const takeAction = async (action: UserMenuActions) => {
    try {
      setLoading({ isLoading: true, loadingMessage: `${action}` });

      if (action === UserMenuActions.DELETE_ACCOUNT) {
        await postData(`${APIBaseURL}/auth`, { method: "delete" });
      } else if (action === UserMenuActions.BLOCK_USER) {
        await postData(`${APIBaseURL}/auth/${user?.userId}/block`, {
          method: "post",
        });
      }

      setLoading({ isLoading: false, loadingMessage: "" });
    } catch (error) {
      handleAsyncError(error, `Error in ${action}`);
    }
  };

  const dismissAllOverlays = () => {
    setOpenActionOverlay(false);
    setOpenMenuOverlay(false);
  };

  useEffect(() => {
    if (!isOwner) {
      actionsRef.current = [UserMenuActions.REPORT, UserMenuActions.BLOCK_USER];
    } else if (isOwner) {
      actionsRef.current = [
        UserMenuActions.UPDATE_PROFILE,
        UserMenuActions.MANAGE_CLUSTERS,
        UserMenuActions.DELETE_ACCOUNT,
      ];
    } else if (isAdmin) {
      actionsRef.current.push(UserMenuActions.MANAGE_ROLE);
    }
  }, [user]);

  return (
    <div>
      <div
        role="button"
        aria-label="user menu"
        onClick={() => setOpenMenuOverlay(!openMenuOverlay)}
      >
        <IonIcon
          id={`user-menu-trigger-${user?.userId}`}
          icon={ellipsisVertical}
        ></IonIcon>
      </div>
      <IonPopover
        trigger={`user-menu-trigger-${user?.userId}`}
        isOpen={openMenuOverlay}
        onDidDismiss={() => setOpenMenuOverlay(false)}
      >
        <IonList>
          {actionsRef.current.map((action) => (
            <IonItem key={action}>
              <span
                role="button"
                onClick={() => {
                  currentActionRef.current = action;
                  setOpenActionOverlay(true);
                }}
              >
                {action}
              </span>
            </IonItem>
          ))}
        </IonList>
      </IonPopover>
      <IonModal
        isOpen={openActionOverlay}
        onDidDismiss={() => setOpenActionOverlay(false)}
      >
        <IonContent>
          <h3>{currentActionRef?.current}</h3>
          {[
            UserMenuActions.BLOCK_USER,
            UserMenuActions.DELETE_ACCOUNT,
          ].includes(currentActionRef.current as UserMenuActions) && (
            <div>
              <p>
                Use the confirm button to confirm your action, and cancel to
                abort or leave action
              </p>

              {["Confirm", "Cancel"].map((item) => (
                <IonButton
                  fill="clear"
                  expand="full"
                  onClick={() => {
                    if (/confirm/i.test(item))
                      takeAction(currentActionRef.current as UserMenuActions);
                    dismissAllOverlays();
                  }}
                >
                  {item}
                </IonButton>
              ))}
            </div>
          )}

          {currentActionRef.current === UserMenuActions.UPDATE_PROFILE && (
            <UpdateUserProfile
              user={user}
              onCompletion={() => dismissAllOverlays()}
            />
          )}

          {currentActionRef.current === UserMenuActions.MANAGE_ROLE && (
            <ManageUserRoles
              user={user}
              onCompletion={() => dismissAllOverlays()}
            />
          )}
          {currentActionRef.current === UserMenuActions.MANAGE_CLUSTERS && (
            <ManageUserClusters
              user={user}
              userClusters={user?.profileClusters?.map((pCltr) => pCltr.cluster)}
              onCompletion={() => dismissAllOverlays()}
            />
          )}

          {currentActionRef.current === UserMenuActions.REPORT && (
            <CreateReport
              serviceType={ServiceType.USER}
              serviceTypeEntityId={user?.id}
              onCompletion={() => dismissAllOverlays()}
            />
          )}
        </IonContent>
      </IonModal>
    </div>
  );
};
