import { useRef, useState } from "react";
import { APIBaseURL, postData } from "../../shared/api/base";
import { useAsyncHelpersContext } from "../../shared/contexts/async-helpers";
import { useLocation } from "react-router";
import {
  IonButton,
  IonCol,
  IonGrid,
  IonInput,
  IonItem,
  IonRow,
  IonTextarea,
} from "@ionic/react";
import { eyeOffSharp, eyeSharp } from "ionicons/icons";

export interface IOTPHandlerProps {
  otpSize: number;
  userEmail: string;
  onCompletion: (dto: { otp: string; email: string }) => void;
  verify: boolean;
}
export const OTPHandler = ({
  onCompletion,
  userEmail,
  otpSize,
  verify,
}: IOTPHandlerProps) => {
  otpSize = otpSize || 6;
  const { setLoading, handleAsyncError } = useAsyncHelpersContext();

  const queryParams = new URLSearchParams(useLocation().search);
  const email = queryParams.get("email") || userEmail;

  const [otpEmail, setOtpEmail] = useState<string>(email as string);

  const currentOtpInputRef = useRef<HTMLInputElement>(
    document.getElementById(`otp-input-0`) as HTMLInputElement
  );
  currentOtpInputRef.current?.focus();

  const [otpMock, setOtpMock] = useState<string[]>([
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
  ]);
 
  const requestOtp = async () => {
    try {
      setLoading({ isLoading: true, loadingMessage: "requesting" });
      await postData(`${APIBaseURL}/auth/request-otp`, {
        method: "post",
        email,
      });
      setLoading({ isLoading: false, loadingMessage: "" });
    } catch (error) {
      handleAsyncError(error, "Error requesting otp");
    }
  };

  const verifyOtp = async () => {
    try {
      setLoading({ isLoading: true, loadingMessage: "updating" });
      await postData(`${APIBaseURL}/auth/verify-otp`, {
        method: "post",
        otpEmail,
        otp: otpMock.join(""),
      });
      setLoading({ isLoading: false, loadingMessage: "" });
      if (onCompletion) onCompletion({ email: otpEmail, otp: otpMock.join() });
    } catch (error) {
      handleAsyncError(error, "Error verifying otp");
    }
  };

  return (
    <IonGrid>
      <IonRow>
        <IonCol size="12">
          <div>
            <h2>OTP</h2>
            <p>Provide the OTP sent to {otpEmail} </p>
          </div>
        </IonCol>
      </IonRow>
      <IonRow>
        <IonCol size="12">
          {!email && (
            <IonItem className="ion-margin-vertical">
              <IonInput
                type="email"
                label="email"
                labelPlacement="stacked"
                value={otpEmail}
                onIonInput={(evt) => {
                  setOtpEmail(evt.detail.value as string);
                }}
              />
            </IonItem>
          )}
          <div style={{display: "flex", justifyContent: "space-between"}}>
            {otpMock.map((otpInput, index) => (
            <input
              key={index}
              style={{textAlign: "center", width: "80px", height: "80px", border: "2px solid green"}}
              id={`otp-input-${index}`}
              maxLength={1}
              placeholder={otpMock[index]}
              aria-label={`otp input ${index}`}
              onInput={(evt) => {
                const otp = otpMock;
                otp[index] = evt.currentTarget.value as string;
                setOtpMock([...otp]);
                if (evt.currentTarget.value?.length) {
                  if (index + 1 >= otpSize) {
                    for(let idx of otpMock) {
                      const otpInput: HTMLInputElement | null =
                        document.getElementById(
                          `otp-input-${idx}`
                        ) as HTMLInputElement;
                      if (!otpInput?.value?.trim()?.length) return otpInput?.focus();
                    }
                    
                    if(onCompletion) return onCompletion({ email: otpEmail, otp: otpMock.join("") });
                    return;

                  }
                  document.getElementById(`otp-input-${index + 1}`)?.focus();
                } else if (evt.currentTarget.value?.length){
                  document.getElementById(`otp-input-${index - 1}`)?.focus();
                }
              }}
            />
          ))}
          </div>
          <div>
            <IonButton
              expand="full"
              onClick={async () => {
                if (verify) await verifyOtp();
                onCompletion({ email: otpEmail, otp: otpMock.join() });
              }}
            >
              <span style={{ color: "white" }}>
                {verify ? "Verify" : "Next"}
              </span>
            </IonButton>
            <IonButton
              expand="full"
              onClick={() => {
                requestOtp();
              }}
            >
              <span style={{ color: "white" }}>Resend OTP to {otpEmail}</span>
            </IonButton>
          </div>
        </IonCol>
      </IonRow>
    </IonGrid>
  );
};
