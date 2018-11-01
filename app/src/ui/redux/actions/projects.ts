import { conditionalLoad } from "./common";
import { ApiClient } from "../..//apiClient";
import {
  findContactsByProject,
  getProject,
  getProjects,
} from "../selectors";

export function loadProject(projectId: string) {
  const selector = getProject(projectId);
  return conditionalLoad(selector.key, selector.store, params => ApiClient.projects.get({id: projectId, ...params}));
}

export function loadProjects() {
  const selector = getProjects();
  return conditionalLoad(selector.key, selector.store, params => ApiClient.projects.getAll(params));
}

export function loadContactsForProject(projectId: string) {
  const selector = findContactsByProject(projectId);
  return conditionalLoad(selector.key, selector.store, params => ApiClient.projectContacts.getAllByProjectId({projectId, ...params}));
}
