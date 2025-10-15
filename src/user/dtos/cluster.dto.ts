import { AddOrRemoveAction } from "../enums/cluster.enum";

export interface ClusterDTO {
    name: string;
    description?: string;

}

export interface ManageClusterOptionDTO {
    action: AddOrRemoveAction;

    override: boolean;
}

export interface ManageClustersDTO {
    clusterIds: number[];

    options: ManageClusterOptionDTO;

}