import { IBooking } from "../../Booking/interfaces/booking";
import { AidServiceProfileVerificationStatus } from "../../shared/enums/aid-service";
import { ICluster } from "../../user/interfaces/cluster";
import { IAuthUserProfile } from "../../user/interfaces/user";
import { TagDTO } from "../dtos/tag.dto";

export interface IAidServiceTag {
  tag: TagDTO;
  aidService: IAidService;
}

export interface IAidServiceCluster {
  cluster: ICluster;
  aidService: IAidService;
}

export interface IAidService {
  id: number;

  name: string;

  description?: string;

  avatar?: string;

  serviceRate?: number;

  noOfBookings: number;
  
  bookings?: IBooking[];
  
  isDeleted?: boolean;
  
  aidServiceTags: IAidServiceTag[];
  
  aidServiceClusters: IAidServiceCluster[];
}


export interface IAidServiceProvider {
    userId: string;
    aidServiceId: number;
}



export interface ICallAidServiceProfileDTO {
  id: number;
  verificationStatus: AidServiceProfileVerificationStatus;
  aidService: IAidService;
  isDeleted: boolean;
}
