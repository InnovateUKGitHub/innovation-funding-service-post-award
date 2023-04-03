import { ProjectStatus } from "@framework/constants";

export interface ProjectStatusDto {
  isActive: boolean;
  status: ProjectStatus;
}
