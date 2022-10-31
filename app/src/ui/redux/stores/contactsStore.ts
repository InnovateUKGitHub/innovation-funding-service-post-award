import { apiClient } from "../../apiClient";
import { StoreBase } from "./storeBase";
import { storeKeys } from "./storeKeys";

export class ContactsStore extends StoreBase {
  public getAllByProjectId(projectId: string) {
    return this.getData("projectContacts", storeKeys.getProjectContactsKey(projectId), p =>
      apiClient.projectContacts.getAllByProjectId({ projectId, ...p }),
    );
  }
  public getAllByProjectIdAsDeveloper(projectId: string) {
    return this.getData("projectContacts", storeKeys.getProjectContactsKeyAsDeveloper(projectId), p =>
      apiClient.projectContacts.getAllByProjectIdAsDeveloper({ projectId, ...p }),
    );
  }
}
