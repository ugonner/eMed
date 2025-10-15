import { PaymentMethod } from "../enums/payment.enum";
import { VerifyPaymentDTO } from "./payment.dto";

  
  export interface InitiatePaymentDto {
    amount: number;
    userId: string;
    email: string;
    channels?: string[];
    currency?: string;
  }
  
  
  export interface PaystackInitiatePaymentResponseDto {
    
      authorization_url: string;
      access_code: string;
      reference: string;
  }
  
  export interface PaystackVerifyPaymentResponseDto {
    amount: number;
    currency: string;
    status: 'success' | 'abandoned' | 'failed';
    reference: string;
    authorization: any;
    customer: {
      email: string;
    };
    metadata: VerifyPaymentDTO;
  }
  
  
  export interface PaystackWebHookPayload {
    event: string;
    data: {
      reference: string;
      status: string;
      amount: number;
      currency: string;
      metadata: VerifyPaymentDTO;
    };
    meta?: unknown;
  }
  
  export interface IPaymentVerifictionResponseDTO {
    status: boolean;
    message: string;
    data: {
      status: string;
      reference: string;
      amount: string;
    }
  }