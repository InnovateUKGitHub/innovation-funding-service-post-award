import { ProjectStatus } from "@framework/constants";

export interface ProjectStatusDto {
  status: ProjectStatus;
  isActive: boolean;
}
