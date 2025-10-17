import { IBooking } from "../../Booking/interfaces/booking";
import { IProfile } from "../../user/interfaces/user";
import { ILocationAddress } from "../dtos/aid-service-profile.dto";

export interface IAidServiceProfile {
  id?: number;

  employeeId: string;

  noOfServicesCompleted: number;

  contactPhoneNumber?: string;

  locationAddress: ILocationAddress;

  verificationComment: string;

  averageRating: number;

  noOfRatings: number;

  profile: IProfile;

  bookings: IBooking[];

  createdAt?: Date;

  isDeleted?: boolean;
}
