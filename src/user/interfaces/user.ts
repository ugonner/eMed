
import { IAuthUser } from "../../auth/components/LoginOrRegister";
import { IAidService, ICallAidServiceProfileDTO } from "../../aid-service/interfaces/aid-service.interface";
import { RoleDTO } from "../../auth/dtos/role.dto";
import { IProfileCluster } from "./cluster";
import { IProfileWallet } from "./user-wallet";
import { IAidServiceProfile } from "../../aid-service/interfaces/aid-service-profile";



export interface IUser {
    id: number;
    userId: string;
    name: string;
}

export interface IProfile {
    id: number;
    userId: string;
    email?: string;
    phoneNumber?: string;
    firstName: string;
    lastName: string;
    avatar?: string;
    gender?: string;
    createdAt?: string;
    profileClusters?: IProfileCluster[];
    profileWallet?: IProfileWallet;
    account?: IAuthUserProfile;
    
}


export interface IAuthUserProfile extends IAuthUser {
    id?: number;
    userId?: string;
    role?: RoleDTO;
    firstName?: string;
    lastName?: string;
    profile?: IProfile;
}

export interface ILoginResponse extends IAuthUserProfile{
    token?: string;
    refreshToken?: string;
}