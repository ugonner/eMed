import { useState } from "react";
import { APIBaseURL, postData } from "../../shared/api/base";
import { useAsyncHelpersContext } from "../../shared/contexts/async-helpers";
import { IChangePasswordDTO } from "../dtos/auth.dto";
import { useLocation } from "react-router";
import {
  IonButton,
  IonCol,
  IonGrid,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonRow,
  useIonRouter,
} from "@ionic/react";
import { eyeOffSharp, eyeSharp } from "ionicons/icons";
import { OTPHandler } from "./OTPHandler";
import { AuthRoutes } from "../enums/routes";

export interface IChangePasswordProps {
    onCompletion?: () => void;
}
export const ChangePassword = ({onCompletion}: IChangePasswordProps) => {
  const { setLoading, handleAsyncError } = useAsyncHelpersContext();
  const router = useIonRouter();

  const queryParams = new URLSearchParams(useLocation().search);
  const email = queryParams.get("email");

  const [changePasswordDto, setChangePasswordDto] = useState<IChangePasswordDTO>({
    email,
  } as IChangePasswordDTO);
  const [pageNumber, setPageNumber] = useState(email ? 2 : 1);
  const [otpMock, setOtpMock] = useState<string[]>([
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
  ]);
  const [showPassword, setShowPassword] = useState(false);

  const changePassword = async () => {
    try {
      setLoading({ isLoading: true, loadingMessage: "updating" });
      await postData(`${APIBaseURL}/auth/reset-password`, {
        method: "post",
        ...changePasswordDto
      });
      setLoading({ isLoading: false, loadingMessage: "" });
      if(onCompletion) onCompletion();
      else router.push(AuthRoutes.LOGIN);
    } catch (error) {
      handleAsyncError(error, "Error requesting otp");
    }
  };

  return (
    <IonGrid>
      <IonRow>
        <IonCol size="12">
          {pageNumber === 1 ? (
            <div>
              <h2>OTP</h2>
              <p>Provide the OTP sent to {changePasswordDto.email} </p>
            </div>
          ) : (
            <div>
              <h2>Credentials</h2>
              <p>Provide credentials as required</p>
            </div>
          )}
        </IonCol>
      </IonRow>
      {pageNumber === 1 && (
        <IonRow>
          <IonCol size="12">
           <OTPHandler
           userEmail={email as string}
           otpSize={6}
           onCompletion={(dto: {otp: string; email: string;}) => {
            setChangePasswordDto({...changePasswordDto, otp: dto.otp, email: dto.email})
            setPageNumber(2)
          }}
           verify={false}
           />

          </IonCol>
        </IonRow>
      )}
      {pageNumber === 3 && (
        <IonRow>
          <IonCol>
            <IonItem>
              <IonInput
                type={showPassword ? "text" : "password"}
                label="Old Password"
                labelPlacement="stacked"
                value={changePasswordDto.oldPassword}
                onIonInput={(evt) => {
                  setChangePasswordDto({
                    ...changePasswordDto,
                    oldPassword: evt.detail.value as string,
                  });
                }}
              />
              <IonLabel>
                <IonIcon
                  role="button"
                  aria-label={showPassword ? "hide password" : "show password"}
                  onClick={() => setShowPassword(!showPassword)}
                  icon={showPassword ? eyeOffSharp : eyeSharp}
                ></IonIcon>
              </IonLabel>
            </IonItem>
            <IonItem>
              <IonInput
                type={showPassword ? "text" : "password"}
                label="New Password"
                labelPlacement="stacked"
                value={changePasswordDto.password}
                onIonInput={(evt) => {
                  setChangePasswordDto({
                    ...changePasswordDto,
                    password: evt.detail.value as string,
                  });
                }}
              />
              <IonLabel>
                <IonIcon
                  role="button"
                  aria-label={showPassword ? "hide password" : "show password"}
                  onClick={() => setShowPassword(!showPassword)}
                  icon={showPassword ? eyeOffSharp : eyeSharp}
                ></IonIcon>
              </IonLabel>
            </IonItem>
            <IonButton
              expand="full"
              role="submit"
              onClick={() => {
                changePassword();
              }}
            >
              Submit
            </IonButton>
          </IonCol>
        </IonRow>
      )}
      <IonRow>
        {["Enter OTP", "Submit Password"].map((item, index) => (
          <IonCol key={index} size="4">
            <IonButton
              expand="full"
              onClick={() => {
                setPageNumber(index + 1);
              }}
            >
              <span style={{ color: "white" }}>{item}</span>
            </IonButton>
          </IonCol>
        ))}
      </IonRow>
    </IonGrid>
  );
};
