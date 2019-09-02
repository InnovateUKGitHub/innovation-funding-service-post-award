import { ApiClient } from "../../apiClient";
import { conditionalLoad } from "./common";
import {
  findContactsByProject,
  getProject,
  getProjects,
} from "../selectors";

export function loadProject(projectId: string) {
  return conditionalLoad(getProject(projectId), params => ApiClient.projects.get({projectId, ...params}));
}

export function loadProjects() {
  return conditionalLoad(getProjects(), params => ApiClient.projects.getAll(params));
}

export function loadContactsForProject(projectId: string) {
  return conditionalLoad(findContactsByProject(projectId), params => ApiClient.projectContacts.getAllByProjectId({projectId, ...params}));
}
