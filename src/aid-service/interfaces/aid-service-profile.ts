import { AidServiceProfileVerificationStatus } from "../../shared/enums/aid-service";
import { IAidService } from "./aid-service.interface";
import { IProfile } from "../../user/interfaces/user";
import { ILocationAddress, ISocialMediaLinks } from "../dtos/aid-service-profile.dto";

export interface IAidServiceProfile {
    id: number;

    name?: string;
  
    verificationStatus: AidServiceProfileVerificationStatus;

  description?: string;

  
  audioCallEarnings?: number;
    
  videoCallEarnings?: number;
  
  onSiteEarnings?: number;
  
  totalEarningsBalance?: number;

  noOfAudioCallServices?: number;
  noOfVideoCallServices?: number;
  noOfOnSiteServices?: number;
  totalServicesRendered?: number;

  businessDocumentUrl?: string;
  
  mediaFile?: string;
  
  contactPhoneNumber?: string;
  
  socialMediaLinks: ISocialMediaLinks;
  
  locationAddress: ILocationAddress;
  
  verificationComment: string;
  
  verifiedBy: IProfile;


  profile: IProfile;

  aidService: IAidService;


  createdAt: Date;

  updatedAt: Date;
  
  isDeleted: boolean;
}