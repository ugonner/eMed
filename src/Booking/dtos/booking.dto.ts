import { ILocationAddress } from "../../aid-service/dtos/aid-service-profile.dto";
import { BookingStatus } from "../enums/booking";
import { VirtualLocationAddressDTO } from "./virtual-location.dto";

export interface BookingDTO {

    
    bookingNote?: string;
    
    locationAddress: ILocationAddress;

    virtualLocationAddress: VirtualLocationAddressDTO;
    
    startDate: string;
    
    duration: number;
    
isVirtualLocation: boolean;
    
    aidServiceId: number;
    
    aidServiceProfileId?: number;
    
}

export interface QueryBookingDTO {
    userId: string;

    bookingStatus?: BookingStatus;

    isMatched: string;
}