import { InputInputEventDetail, IonInputCustomEvent } from "@ionic/core";
import {
  IonButton,
  IonContent,
  IonHeader,
  IonImg,
  IonInput,
  IonItem,
  IonModal,
  IonSegment,
  IonSegmentButton,
  IonTitle,
  useIonRouter,
  useIonToast,
} from "@ionic/react";
import { Dispatch, FormEvent, useRef, useState } from "react";
import { APIBaseURL, postData } from "../../shared/api/base";
import {
  IAuthUserProfile,
  ILoginResponse,
  IProfile,
} from "../../user/interfaces/user";
import { useAuthGuardContextStore } from "../contexts/AuthGuardContext";
import { useAsyncHelpersContext } from "../../shared/contexts/async-helpers";
import { usePresentToast } from "../../shared/helpers";
import { LocalStorageEnum } from "../../shared/enums";
import { OTPHandler } from "./OTPHandler";
import { ManageUserClusters } from "../../user/components/cluster/ManageUserClusters";
import { AuthRoutes } from "../enums/routes";
import { UserRoutes } from "../../user/enums/routes.enum";
import { HomeRoutes } from "../../home/enums/routes";

export interface IAuthUser {
  email?: string;
  password: string;
  phoneNumber?: string;
  firstName?: string;
  lastName?: string;
}

export interface ILoginOrCreateUserProps {
  onSuccess?: () => void;
}

export const LoginOrRegister = ({ onSuccess }: ILoginOrCreateUserProps) => {
  const { setIsLoggedIn } = useAuthGuardContextStore();
  const { setLoading, handleAsyncError } = useAsyncHelpersContext();
  const router = useIonRouter();

  const [isSignUp, setIsSignUp] = useState(false);
  const [authUser, setAuthUser] = useState<IAuthUserProfile>(
    {} as IAuthUserProfile
  );
  const [showPassword, setShowPassword] = useState(false);
  const [usePhoneNumber, setUsePhoneNumber] = useState(false);

  const passwordRef = useRef<string>();

  const [openHandleOtpOverlay, setOpenHandleOtpOverlay] = useState(false);

  const handleInput = (e: FormEvent<HTMLIonInputElement>) => {
    const { name, value } = e.currentTarget;
    setAuthUser({ ...authUser, [name]: value });
  };

  const verifyAccount = async (dto: { otp: string; email: string }) => {
    try {
      setLoading({ isLoading: true, loadingMessage: "verifying" });
      dto.otp = Number(dto.otp) as unknown as string;
      await postData(`${APIBaseURL}/auth/verify`, {
        method: "post",
        ...dto,
      });
      setLoading({ isLoading: false, loadingMessage: "" });
      setOpenHandleOtpOverlay(false)
      login();
      
    } catch (error) {
      handleAsyncError(error, "Error verifying account");
      login();
   
    }
  };
  const requestOtp = async (dto: { email: string }) => {
    try {
      setLoading({ isLoading: true, loadingMessage: "verifying" });
      await postData(`${APIBaseURL}/auth/request-otp`, {
        method: "post",
        ...dto,
      });
      setLoading({ isLoading: false, loadingMessage: "" });
    } catch (error) {
      handleAsyncError(
        error,
        "Error requesting forgot password otp for account"
      );
    }
  };
  const signUp = async () => {
    try {
      setLoading({ isLoading: true, loadingMessage: "Signing Up" });
      await postData(`${APIBaseURL}/auth/register`, {
            method: "post",
            ...authUser,
            password: passwordRef.current as string
          })
        
      setLoading({ isLoading: false, loadingMessage: "" });
      setOpenHandleOtpOverlay(true);
      
      
    } catch (error) {
      handleAsyncError(error, "Error signing up or logging in");
    }
  };
const login = async () => {
    try {
      setLoading({ isLoading: true, loadingMessage: "logging in" });
      const res = await postData(`${APIBaseURL}/auth/login`, {
            method: "post",
            ...authUser,
            password: passwordRef.current
          });
      
      setAuthUser(res as IAuthUserProfile);
      localStorage.setItem(
        LocalStorageEnum.USER,
        JSON.stringify(res as IAuthUserProfile)
      );
      if ((res as ILoginResponse).token)
        localStorage.setItem(
          LocalStorageEnum.TOKEN,
          `${(res as ILoginResponse).token}`
        );
    setLoading({ isLoading: false, loadingMessage: "" });
    if (onSuccess) onSuccess();
    else window.location.href = `${HomeRoutes.HOME}`;
      
    } catch (error) {
      handleAsyncError(error, "Error signing up or logging in");
    }
  };

  return (
    <>
      <IonContent className="ion-padding">
       
        <div className="ion-text-center">
          <img src="/favicon.png" alt="able aid" style={{width: "100px", height: "auto"}}/>
          <h1>Welcome to AbleAid &trade;  </h1>
          <p>
            You are welcome to AbleAid, Your effort to enjoying and promoting inclusive service delivery is just A Sign Up Away.
          </p>
          <small>What have you done to promote an inclusive society today? Sign in and Book A Service for your event</small>
        </div>
        <div className="">
          
          <form>
            <div className="">
              {usePhoneNumber ? (
                <IonItem>
                  <IonInput
                    type="tel"
                    name="phoneNumber"
                    label="Phone Number"
                    value={authUser.phoneNumber}
                    labelPlacement="floating"
                    onInput={handleInput}
                    required={true}
                  ></IonInput>
                </IonItem>
              ) : (
                <IonItem>
                  <IonInput
                    type="email"
                    name="email"
                    label="Email"
                    labelPlacement="floating"
                    onInput={handleInput}
                    required={true}
                  ></IonInput>
                </IonItem>
              )}
            </div>

            <div className="">
              <IonItem>
                <IonInput
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={authUser.password}
                  label="password"
                  labelPlacement="floating"
                  onInput={(evt) => {
                    passwordRef.current = evt.currentTarget.value as string
                    handleInput(evt); 
                  }}
                ></IonInput>
              </IonItem>
              <IonButton
                fill="clear"
                size="small"
                onClick={() => setShowPassword(!showPassword)}
              >
                show / hide password
              </IonButton>
            </div>

            {isSignUp ? (
              <div>
                <div className="">
                  <IonItem>
                    <IonInput
                      type="text"
                      name="firstName"
                      value={authUser.firstName}
                      fill="solid"
                      label="firstName"
                      labelPlacement="floating"
                      onInput={handleInput}
                    ></IonInput>
                  </IonItem>
                </div>

                <div className="">
                  <IonItem>
                    <IonInput
                      type="text"
                      name="lastName"
                      value={authUser.lastName}
                      fill="solid"
                      label="lastName"
                      labelPlacement="floating"
                      onInput={handleInput}
                    ></IonInput>
                  </IonItem>
                </div>
              </div>
            ) : (
              <></>
            )}
            <div className="form-group">
              <IonButton size="large" expand="full" onClick={() => {
                if(isSignUp) {
                  signUp()
                  .then(() => login())
                  
                }
                else login();
              }}>
                {isSignUp ? "Register" : "Login"}
              </IonButton>
              <div>
                <IonButton
                  size="large"
                  expand="full"
                  fill="clear"
                  onClick={() => setIsSignUp(true)}
                >
                  <small
                    style={{ textTransform: "capitalize", fontWeight: "bold" }}
                  >
                    New Account, Sign up
                  </small>
                </IonButton>
                <IonButton
                  size="large"
                  expand="full"
                  fill="clear"
                  onClick={() => setIsSignUp(false)}
                >
                  <small
                    style={{ textTransform: "capitalize", fontWeight: "bold" }}
                  >
                    Existing User, Log In
                  </small>
                </IonButton>
              </div>
              <div>
                <IonButton
                  fill="clear"
                  expand="full"
                  onClick={async () => {
                    await requestOtp({ email: authUser.email as string });
                    router.push(AuthRoutes.RESET_PASSWORD);
                  }}
                >
                  <span style={{ color: "white" }}>
                    Forgot Password? Click here
                  </span>
                </IonButton>
              </div>
            </div>
          </form>
        </div>
        <IonModal
          isOpen={openHandleOtpOverlay}
          onDidDismiss={() => setOpenHandleOtpOverlay(false)}
        >
          <IonContent>
            <OTPHandler
              otpSize={6}
              userEmail={authUser.email as string}
              onCompletion={async (dto: { otp: string; email: string }) => {
                await verifyAccount(dto);
              }}
              verify={false}
            />
          </IonContent>
        </IonModal>

       
      </IonContent>
    </>
  );
};
