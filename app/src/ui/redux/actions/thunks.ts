import { conditionalLoad } from "./dataLoad";
import { ApiClient } from "../../../shared/apiClient";

export function loadContacts() {
  return conditionalLoad(
    "all",
    "contacts",
    () => ApiClient.contacts.getAll()
  );
}

export function loadContact(id: string) {
  return conditionalLoad(
    id,
    "contact",
    () => ApiClient.contacts.get(id)
  );
}

export function loadProject(id: string) {
  return conditionalLoad(
    id,
    "project",
    () => {
      return ApiClient.projects.get(id);
    }
  );
}

export function loadProjects() {
  return conditionalLoad(
    "all",
    "projects",
    () => ApiClient.projects.getAll()
  );
}

export function loadPatnersForProject(projectId: string) {
  return conditionalLoad(
    projectId,
    "partners",
    () => ApiClient.partners.getAllByProjectId(projectId)
  );
}

export function loadContactsForProject(projectId: string) {
  return conditionalLoad(
    projectId,
    "projectContacts",
    () => ApiClient.projectContacts.getAllByProjectId(projectId)
  );
}
