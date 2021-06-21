import { apiClient } from "../../apiClient";
import { StoreBase } from "./storeBase";

export class ContactsStore extends StoreBase {
  public getAllByProjectId(projectId: string) {
    return this.getData("projectContacts", projectId, p => apiClient.projectContacts.getAllByProjectId({ projectId, ...p }));
  }
}
