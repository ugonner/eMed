import { TagDTO } from "./tag.dto";

export interface AidServiceDTO {
  id?: number;

  name: string;

  description?: string;

  avatar?: string;

  audioCallRate?: number;

  videoCallRate?: number;

  onSiteRate?: number;

  tags: TagDTO[];

  clusterIds?: number[];
}