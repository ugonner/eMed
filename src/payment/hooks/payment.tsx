import { Browser } from "@capacitor/browser";
import { APIBaseURL, postData } from "../../shared/api/base";
import { useAsyncHelpersContext } from "../../shared/contexts/async-helpers";
import { IApiResponse } from "../../shared/interfaces/api-response";
import { PaymentDTO } from "../dtos/payment.dto";
import { PaystackInitiatePaymentResponseDto } from "../dtos/paystack.dto";

export interface IUsePaymentMembers {
  makePayment: (dto: PaymentDTO) => void;
}

export const usePayment = (): IUsePaymentMembers => {
  const { setLoading, handleAsyncError } = useAsyncHelpersContext();

  const makePayment = async (dto: PaymentDTO) => {
    try {
      setLoading({ isLoading: true, loadingMessage: "initiating paymnet" });

      const res = await postData<
        IApiResponse<PaystackInitiatePaymentResponseDto>
      >(`${APIBaseURL}/transaction/pay`, {
        method: "post",
        ...dto,
      });
      Browser.open({ url: res.data?.authorization_url as string });
    } catch (error) {
      handleAsyncError(error, "Error generating payment link");
    }
  };
  return { makePayment };
};
