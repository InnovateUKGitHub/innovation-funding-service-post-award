import {conditionalLoad} from "./dataLoad";
import {ApiClient} from "../../../shared/apiClient";
import { findContactsByProject, projectContactsStore } from "../selectors/projectContacts";

export function loadContactsForProject(projectId: string) {
  return conditionalLoad(
    findContactsByProject(projectId).key,
    projectContactsStore,
    (params) => ApiClient.projectContacts.getAllByProjectId({projectId, ...params})
  );
}
