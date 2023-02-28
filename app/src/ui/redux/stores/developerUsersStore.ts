import { apiClient } from "../../apiClient";
import { StoreBase } from "./storeBase";
import { storeKeys } from "./storeKeys";

export class DeveloperUsersStore extends StoreBase {
  public getAllByProjectId(projectId: ProjectId) {
    return this.getData("developerUsers", storeKeys.getDeveloperUsersKey(projectId), p =>
      apiClient.developerUsers.getAllByProjectId({ projectId, ...p }),
    );
  }
}
