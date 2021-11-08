import { ProjectStatus } from "@framework/constants";
import { ProjectDto } from "@framework/dtos";

const inactiveProjectStatuses = [ProjectStatus.OnHold, ProjectStatus.Closed, ProjectStatus.Terminated];

export function getIsProjectActive({status}: Pick<ProjectDto, "status">) {
  return !inactiveProjectStatuses.includes(status);
}
