
export interface ISocialMediaLinks {
    facebook?: string;
    x: string;
    linkedIn?: string;
}

export interface ILocationAddress {
    street: string;
    city: string;
    state?: string;
    country?: string;
    landmark?: string;
}

export interface AidServiceProfileDTO {
  id?: number;
  name?: string;
  description?: string;
  aidServiceId: number;
  businessDocumentUrl: string;
  mediaFile: string;
  socialMediaLinks: ISocialMediaLinks;
  locationAddress: ILocationAddress;
  contactPhoneNumber?: string;
  
}