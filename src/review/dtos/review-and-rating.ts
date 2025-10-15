import { ServiceType } from "../enums/service";

export interface ReviewAndRatingDTO {
    rating: number;
    review: string;
    serviceType: ServiceType;
    serviceTypeEntityId: number;
}