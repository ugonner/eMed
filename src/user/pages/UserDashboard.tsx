import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { APIBaseURL, getData, postData } from "../../shared/api/base";
import {
  IonButton,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonModal,
  IonPopover,
  IonRow,
  IonTitle,
  useIonAlert,
  useIonRouter,
} from "@ionic/react";
import { QueryFilter } from "../../shared/components/general/QueryFilter";
import {
  chatbox,
  closeCircle,
  ellipsisHorizontal,
  folderOpen,
  folderOpenOutline,
  idCard,
  text,
} from "ionicons/icons";
import { Pagination } from "../../shared/components/general/Pagination";
import { UserCard } from "../components/UserCard";
import { CreateRole } from "../components/role/CreateRole";
import { useAsyncHelpersContext } from "../../shared/contexts/async-helpers";
import { IQueryResult } from "../../shared/interfaces/api-response";
import { RoleDTO } from "../../auth/dtos/role.dto";
import { IAuthUserProfile, IProfile } from "../interfaces/user";

export const UserDashboard = () => {
  const { setLoading, handleAsyncError } = useAsyncHelpersContext();

  const [presentAlert] = useIonAlert();
  const router = useIonRouter();

  const [queryResult, setQueryResult] = useState<
    IQueryResult<IAuthUserProfile>
  >({} as unknown as IQueryResult<IAuthUserProfile>);
  const queryPayloadRef = useRef<{ [key: string]: unknown }>({});
  const queryBaseuRL = `${APIBaseURL}/user`;
  const [openIAuthUserProfileMenuOverlay, setOpenIAuthUserProfileMenuOverlay] =
    useState(false);
  const [openMessageUsersOverlay, setOpenMessageUsersOverlay] = useState(false);
  const [userMessage, setUserMessage] = useState<{
    type?: "Email" | "SMS";
    text?: string;
  }>({ type: "Email" });
  const rolesRef = useRef<RoleDTO[]>([]);

  const [openCreateRoleOverlay, setOpenCreateRoleOverlay] = useState(false);
  const [openEditRoleOverlay, setOpenEditRoleOverlay] = useState(false);
  const [selectedRole, setSelectedRole] = useState<RoleDTO>();

  const sendUsersMessage = async () => {
    try {
      setLoading({ isLoading: true, loadingMessage: "sending user messages" });
      await postData(`${APIBaseURL}/user/send-message`, {
        method: "post",
        ...queryPayloadRef.current,
        message: userMessage.text,
        messageType: userMessage.type,
      });
      setLoading({ isLoading: false, loadingMessage: "" });
    } catch (error) {
      handleAsyncError(error, "Error sending user messages");
    }
  };
  const getRoles = async () => {
    try {
      setLoading({ isLoading: true, loadingMessage: "updating role record" });
      const res = await getData<RoleDTO[]>(`${APIBaseURL}/auth/role`);
      rolesRef.current = res;
      setLoading({ isLoading: false, loadingMessage: "" });
    } catch (error) {
      handleAsyncError(error, "Error updating role record");
    }
  };

  const getIAuthUserProfiles = async (queryPayload: {
    [key: string]: unknown;
  }) => {
    try {
      const res = await getData<IQueryResult<IAuthUserProfile>>(
        queryBaseuRL,
        queryPayload
      );
      setQueryResult(res);
    } catch (error) {
      handleAsyncError(error, "Error fetching users");
    }
  };
  useEffect(() => {
    getRoles();
    getIAuthUserProfiles({});
  }, []);

  return (
    <>
      <IonHeader>
        <IonTitle>Users</IonTitle>
      </IonHeader>
      <IonContent>
        <IonGrid>
          <IonRow>
            <IonCol size="12" sizeSm="6">
              <IonItem>
                <IonInput
                  type="search"
                  aria-label="search users"
                  placeholder="Search users"
                  onIonInput={(evt) => {
                    const { value } = evt.detail;
                    if (value && value?.length <= 3) return;
                    getIAuthUserProfiles({ searchTerm: evt.detail.value });
                    queryPayloadRef.current = { searchTerm: value };
                  }}
                  debounce={300}
                ></IonInput>
              </IonItem>
            </IonCol>
            <IonCol size="12" sizeSm="6">
              <IonItem>
                <QueryFilter
                  queryPayloadRef={queryPayloadRef}
                  setResult={setQueryResult}
                  queryUrl={queryBaseuRL}
                  queryInputs={[
                    {
                      type: "dateRange",
                      name: "Creation Date (Range)",
                      value: "dateRange",
                    },
                    {
                      type: "dateRange",
                      name: "Creation Date (specific)",
                      value: "dateRange",
                    },
                  ]}
                ></QueryFilter>
              </IonItem>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol size="6">
              <div className="ion-text-large ion-text-lg">
                {queryResult.total}
                <br /> <small>Total</small>
              </div>
            </IonCol>
            <IonCol size="6">
              <IonItem>
                <IonButton
                  fill="clear"
                  slot="end"
                  aria-label="more options"
                  role="menu"
                  onClick={() => {
                    setOpenMessageUsersOverlay(!openMessageUsersOverlay);
                  }}
                  aria-haspopup={true}
                  aria-expanded={openMessageUsersOverlay}
                >
                  <IonIcon icon={chatbox} className="ion-margin"></IonIcon>{" "}
                  Message User Group
                </IonButton>
              </IonItem>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol size="12" sizeSm="6">
              <h3>Manage Roles</h3>
              <IonList>
                {rolesRef.current.map((role) => (
                  <IonItem key={role.id}>
                    <IonLabel>
                      <h4>{role.name}</h4>
                      <small>{role.description}</small>
                    </IonLabel>
                    <IonButton
                      slot="end"
                      aria-haspopup={true}
                      onClick={() => {
                        setSelectedRole(role);
                        setOpenEditRoleOverlay(true);
                      }}
                    >
                      Edit
                    </IonButton>
                  </IonItem>
                ))}
              </IonList>
            </IonCol>
            <IonCol size="12" sizeSm="6">
              <IonItem>
                <IonButton
                  color={"dark"}
                  aria-haspopup={true}
                  aria-expanded={openCreateRoleOverlay}
                  onClick={() =>
                    setOpenCreateRoleOverlay(!openCreateRoleOverlay)
                  }
                >
                  + Add Role
                </IonButton>
              </IonItem>
            </IonCol>
          </IonRow>
          {queryResult.data?.map((user, index) => (
            <IonRow key={index}>
              <UserCard showMenu={true} user={user as IProfile} />
            </IonRow>
          ))}

          {!queryResult.data?.length && (
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "2em" }}>
                <IonIcon icon={folderOpenOutline}></IonIcon>
              </div>
              <div>No Items</div>
            </div>
          )}
          <IonRow>
            <IonCol size="12">
              <Pagination
                queryBaseUrl={queryBaseuRL}
                queryPayloadRef={queryPayloadRef}
                setQueryResult={setQueryResult}
                totalItems={queryResult.total}
                limit={queryResult.limit || 10}
              ></Pagination>
            </IonCol>
          </IonRow>
        </IonGrid>

        <IonModal
          isOpen={openMessageUsersOverlay}
          onDidDismiss={() => setOpenMessageUsersOverlay(false)}
        >
          <IonHeader>
            Send Message To Users
            <IonItem>
              <IonButton
                fill="clear"
                slot="end"
                aria-label="close message view"
                role="menu"
                onClick={() => {
                  setOpenMessageUsersOverlay(false);
                }}
              >
                <IonIcon icon={closeCircle}></IonIcon>
              </IonButton>
            </IonItem>
          </IonHeader>
          <IonContent>
            <label htmlFor="users-message">Message</label>
            <br />
            <textarea
              className="ion-margin ion-large lg"
              id="users-message"
              cols={140}
              placeholder="Type in message"
              onInput={async (evt: FormEvent<HTMLTextAreaElement>) => {
                const { value } = evt.currentTarget;
                setUserMessage({ text: value });
              }}
            ></textarea>

            <IonItem>
              <IonButton
                color={"dark"}
                onClick={async () => {
                  await sendUsersMessage();
                }}
              >
                Send Message
              </IonButton>
            </IonItem>
          </IonContent>
        </IonModal>
        <IonModal
          isOpen={openEditRoleOverlay}
          onDidDismiss={() => setOpenEditRoleOverlay(false)}
        >
          {" "}
          <IonHeader>
            Edit {selectedRole?.name}
            <IonItem>
              <IonButton
                fill="clear"
                slot="end"
                aria-label="close edit role view"
                role="menu"
                onClick={() => {
                  setOpenEditRoleOverlay(false);
                }}
              >
                <IonIcon icon={closeCircle}></IonIcon>
              </IonButton>
            </IonItem>
          </IonHeader>
          <IonContent>
            <CreateRole
              roleData={selectedRole}
              onCompletion={() => setOpenEditRoleOverlay(false)}
            ></CreateRole>
          </IonContent>
        </IonModal>
        <IonModal
          isOpen={openCreateRoleOverlay}
          onDidDismiss={() => setOpenCreateRoleOverlay(false)}
        >
          {" "}
          <IonHeader>
            Create Role
            <IonItem>
              <IonButton
                fill="clear"
                slot="end"
                aria-label="close create role view"
                role="menu"
                onClick={() => {
                  setOpenCreateRoleOverlay(false);
                }}
              >
                <IonIcon icon={closeCircle}></IonIcon>
              </IonButton>
            </IonItem>
          </IonHeader>
          <IonContent>
            <CreateRole
              onCompletion={() => setOpenEditRoleOverlay(false)}
            ></CreateRole>
          </IonContent>
        </IonModal>
      </IonContent>
    </>
  );
};
