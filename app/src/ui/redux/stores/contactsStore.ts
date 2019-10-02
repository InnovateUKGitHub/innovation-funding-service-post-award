import { ApiClient } from "../../apiClient";
import { StoreBase } from "./storeBase";

export class ContactsStore extends StoreBase {
  public getAllByProjectId(projectId: string) {
    return this.getData("projectContacts", projectId, p => ApiClient.projectContacts.getAllByProjectId({ projectId, ...p }));
  }
}
