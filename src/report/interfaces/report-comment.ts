import { IProfile } from "../../user/interfaces/user";
import { IReport } from "./report";

export interface IReportComment {
    id?: number;

    comment: string;

    profile: IProfile

    report: IReport;

    createdAt: string;

    updatedAt:  string;

    isDeleted: boolean;
}