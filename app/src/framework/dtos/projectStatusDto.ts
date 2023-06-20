import { ProjectStatus } from "@framework/constants/project";

export interface ProjectStatusDto {
  isActive: boolean;
  status: ProjectStatus;
}
