import { ILocationAddress } from "../../aid-service/dtos/aid-service-profile.dto";
import { IAidServiceProfile } from "../../aid-service/interfaces/aid-service-profile";
import { IAidService } from "../../aid-service/interfaces/aid-service.interface";
import { IProfile } from "../../user/interfaces/user";
import { VirtualLocationAddressDTO } from "../dtos/virtual-location.dto";
import { BookingStatus } from "../enums/booking";

export enum PaymentStatus {
    PAID = "Paid",
    UNPAID = "UnPaid"
}
export interface IBooking {
id: number;

  compositeBookingId: string;

  bookingStatus: BookingStatus;

  bookingStatusNote?: string;

  paymentStatus: PaymentStatus;

  totalAmount: number;

  bookingNote: string;

  locationAddress: ILocationAddress;

  startDate: string;

  endDate: string;

  confirmedByProvider: boolean;

  confirmedByUser: boolean;

  rating: number;

  review: string;

  isMatched: boolean;

  aidService: IAidService;

  aidServiceProfile: IAidServiceProfile;

  profile?: IProfile;

 
  createdAt?: string;


  isDeleted?: boolean;
  
}