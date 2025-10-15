import { IProfile } from "./user";

export interface ICluster {
    id?: number;
    name: string;
    description?: string
}

export interface IProfileCluster {
    id?: number;
    profile: IProfile;
    cluster: ICluster;
}

