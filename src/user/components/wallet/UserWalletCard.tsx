import { useState } from "react";
import { APIBaseURL, postData } from "../../../shared/api/base";
import { useAsyncHelpersContext } from "../../../shared/contexts/async-helpers";
import { IProfileWallet } from "../../interfaces/user-wallet";
import {
  IonButton,
  IonCol,
  IonContent,
  IonGrid,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonModal,
  IonRow,
} from "@ionic/react";
import { formatCurrency } from "../../../utils";
import { caretDown, caretDownSharp, closeCircle } from "ionicons/icons";
import { PaymentDTO } from "../../../payment/dtos/payment.dto";
import {
  PaymentMethod,
  PaymentPurpose,
} from "../../../payment/enums/payment.enum";
import { IApiResponse } from "../../../shared/interfaces/api-response";
import { PaystackInitiatePaymentResponseDto } from "../../../payment/dtos/paystack.dto";
import { Browser } from "@capacitor/browser";

export interface IUserProfileWalletCardProps {
  userWallat?: IProfileWallet;
  onCompletion?: () => void;
}

export const UserProfileWalletCard = ({
  userWallat,
  onCompletion,
}: IUserProfileWalletCardProps) => {
  const { setLoading, handleAsyncError } = useAsyncHelpersContext();
  const [fundingAmount, setFundingAmount] = useState<number>();
  const [openFundingOverlay, setOpenFundingOverlay] = useState(false);
  const [openWalletBalanceOverlay, setOpenWalletBalanceOverlay] =
    useState(false);

  const closeOverlays = () => {
    setOpenFundingOverlay(false);
    setOpenWalletBalanceOverlay(false);
  };

  const fundWallet = async () => {
    try {
      setLoading({ isLoading: true, loadingMessage: "loading" });
      const dto: PaymentDTO = {
        amount: Number(fundingAmount),
        paymentMethod: PaymentMethod.PAYSTACK,
        paymentPurpose: PaymentPurpose.FUND_DEPOSIT,
      };

      const res = await postData<IApiResponse<PaystackInitiatePaymentResponseDto>>(`${APIBaseURL}/transaction/pay`, {
        method: "post",
        ...dto,
      });
      setLoading({ isLoading: false, loadingMessage: "" });
      closeOverlays();
      if (onCompletion) onCompletion();
      Browser.open({url: `${res.data?.authorization_url}`});
    } catch (error) {
      handleAsyncError(error, "Error initiating wallet fundig payment link");
    }
  };

  const walletItems: {
    label: string;
    value: unknown;
    icon?: string;
  }[] = [
    { label: "Deposited", value: userWallat?.fundedBalance },
    { label: "Pending", value: userWallat?.pendingBalance },
    { label: "Earned", value: userWallat?.earnedBalance },
  ];

  return (
    <>
      <IonItem>
        <IonLabel>
          <h2>{formatCurrency(userWallat?.fundedBalance || 0)}</h2>
          <small>Deposit</small>
        </IonLabel>
        <IonIcon
        role="button"
        aria-label="show / hide all wallet balances"
        aria-haspopup={true}
        aria-expanded={openWalletBalanceOverlay}
        onClick={() => setOpenWalletBalanceOverlay(!openWalletBalanceOverlay)}
          icon={caretDownSharp}
          className="ion-margin-horizontal"
        ></IonIcon>
      </IonItem>

      <IonModal
        isOpen={openWalletBalanceOverlay}
        onDidDismiss={() => setOpenWalletBalanceOverlay(false)}
      >
        <IonContent>
          <IonItem>
            <IonButton
            fill="clear"
            slot="end"
            aria-label="close"
            onClick={() => setOpenWalletBalanceOverlay(false)}
            >
              <IonIcon icon={closeCircle}></IonIcon>
            </IonButton>
          </IonItem>
          <IonGrid>
            <IonRow>
              {walletItems.map((item) => (
                <IonCol key={item.label} size="12">
                  <div className="ion-text-center">
                    <div style={{ fontSize: "2em" }}>
                      {formatCurrency(item.value as number)}
                    </div>
                    <div style={{ fontSize: "0.8em" }}>{item.label}</div>
                  </div>
                </IonCol>
              ))}
            </IonRow>
            <IonRow>
              <IonCol size="12">
                <IonButton
                  onClick={() => setOpenFundingOverlay(!openFundingOverlay)}
                  expand="full"
                >
                  Fund Wallet
                </IonButton>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonContent>
      </IonModal>
      <IonModal
        isOpen={openFundingOverlay}
        onDidDismiss={() => setOpenFundingOverlay(false)}
      >
        <h2>Fund Your Wallet</h2>
        
          <IonItem>
            <IonButton
            fill="clear"
            slot="end"
            aria-label="close"
            onClick={() => closeOverlays()}
            >
              <IonIcon icon={closeCircle}></IonIcon>
            </IonButton>
          </IonItem>
        <IonItem>
          <IonInput
            type="number"
            label="Deposit Amount"
            labelPlacement="stacked"
            onIonInput={async (evt) => {
              setFundingAmount(Number(evt.detail.value));
            }}
          />
        </IonItem>
        <IonButton expand="full" onClick={() => fundWallet()}>
          Fund Wallet with {formatCurrency(fundingAmount as number)}
        </IonButton>
        <IonButton
          onClick={() => {
            closeOverlays();
            if (onCompletion) onCompletion();
          }}
        >
          Cancel
        </IonButton>
      </IonModal>
    </>
  );
};
