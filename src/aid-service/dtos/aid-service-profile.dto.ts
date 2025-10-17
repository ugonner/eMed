export interface ISocialMediaLinksDTO {
  facebook?: string;

  x: string;

  linkedIn?: string;
}

export interface ILocationAddress {
  longitude?: number;
  latitude?: number;
  street: string;
  city: string;
  locality?: string;
  state?: string;
  country?: string;
  landmark?: string;
}

export interface AidServiceProfileDTO {
  id?: number;
  locationAddress: ILocationAddress;
  contactPhoneNumber?: string;
}
