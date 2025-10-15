import { PaymentMethod, PaymentPurpose, PaymentStatus } from "../enums/payment.enum";

export interface PaymentDTO {
  
    bookingId?: number;

    amount?: number;

    paymentMethod: PaymentMethod;

    paymentPurpose: PaymentPurpose;
}

export interface VerifyPaymentDTO{
    transactionId: string;
paymentStatus: PaymentStatus;
}


  