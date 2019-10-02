import { StoreBase } from "./storeBase";
import { ApiClient } from "@ui/apiClient";

export class ClaimsStore extends StoreBase {
  getAllClaimsForProject(projectId: string) {
    return this.getData("claims", projectId, p => ApiClient.claims.getAllByProjectId({ projectId, ...p }));
  }

  getInactiveClaimsForProject(projectId: string) {
    return this.getAllClaimsForProject(projectId).then(x => x.filter(claim => claim.isApproved));
  }

  getActiveClaimsForProject(projectId: string) {
    return this.getAllClaimsForProject(projectId).then(x => x.filter(claim => !claim.isApproved));
  }

}
