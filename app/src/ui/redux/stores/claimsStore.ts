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

  getAllClaimsForPartner(partnerId: string) {
    return this.getData("claims", partnerId, p => ApiClient.claims.getAllByPartnerId({partnerId, ...p}));
  }

  getActiveClaimForPartner(partnerId: string) {
    return this.getAllClaimsForPartner(partnerId).then(x => x.find( y => !y.isApproved) || null);
  }
}
