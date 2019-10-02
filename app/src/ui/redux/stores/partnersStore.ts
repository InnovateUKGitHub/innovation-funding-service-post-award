import { StoreBase } from "./storeBase";
import { RootState } from "../reducers";
import { ApiClient } from "@ui/apiClient";

export class PartnersStore extends StoreBase {
  constructor(getState: () => RootState, dispatch: (action: any) => void) {
    super(getState, dispatch);
  }

  public getAll() {
    return this.getData("partners", "all", p => ApiClient.partners.getAll({ ...p }));
  }

  public getPartnersForProject(projectId: string) {
    return this.getData("partners", projectId, p => ApiClient.partners.getAllByProjectId({ projectId, ...p }));
  }

  public getById(partnerId: string) {
    return this.getData("partner", partnerId, p => ApiClient.partners.get({ partnerId, ...p }));
  }

  public getLeadPartner(projectId: string) {
    return this.getPartnersForProject(projectId).then(x => x.find(y => y.isLead)!);
  }

}
