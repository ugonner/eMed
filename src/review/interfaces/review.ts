import { IBooking } from "../../Booking/interfaces/booking";
import { IProfile } from "../../user/interfaces/user";
import { ServiceType } from "../enums/service";

export interface IReviewAndRating {
    id: number;

    rating: number;

    review: string;

    serviceType: ServiceType;

    serviceTypeEntityId: number;

    profileId: number;

    profile?: IProfile;

    booking?: IBooking;

    createdAt: string;

    isDeleted: boolean;
}