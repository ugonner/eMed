import { IProfile } from "./user";

export interface IProfileWallet {
  id: number;

  fundedBalance: number;
  
  earnedBalance: number;
  
  pendingBalance: number;

  profile: IProfile;


  createdAt: Date;


  updatedAt: Date;

  
  isDeleted: boolean;
}
