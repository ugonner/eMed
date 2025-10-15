import { ServiceType } from "../../review/enums/service";
import { IProfile } from "../../user/interfaces/user";

export interface IReport {
    id?: number;

    review: string;

    serviceType: ServiceType;

    serviceTypeEntityId: number;

    profileId: number;

    isResolved: boolean;

    resolvedById: number;

    profile: IProfile;

    entityOwner: IProfile;

    comment?: string;

    createdAt?: string;

    isDeleted: boolean;
}