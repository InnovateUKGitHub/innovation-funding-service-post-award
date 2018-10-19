import {conditionalLoad} from "./dataLoad";
import {ApiClient} from "../../../shared/apiClient";
import { getProjects, projectsStore } from "../selectors/projects";

export function loadProjects() {
  return conditionalLoad(
    getProjects().key,
    projectsStore,
    () => ApiClient.projects.getAll()
  );
}
