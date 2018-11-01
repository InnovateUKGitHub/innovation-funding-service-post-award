import { conditionalLoad } from "./dataLoad";
import { ApiClient } from "../../apiClient";
import { getProjects, projectsStore } from "../selectors/projects";

export function loadProjects() {
  return conditionalLoad(
    getProjects().key,
    projectsStore,
    (params) => ApiClient.projects.getAll(params)
  );
}
