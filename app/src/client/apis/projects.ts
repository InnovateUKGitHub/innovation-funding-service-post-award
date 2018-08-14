import { ProjectDto } from "../../models";

export function get(id: string): Promise<ProjectDto> {
  return fetch(`http://localhost:8080/api/projects/${id}`) as any;
}
