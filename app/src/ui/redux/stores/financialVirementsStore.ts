import { StoreBase } from "./storeBase";
import { ApiClient } from "@ui/apiClient";
import { LoadingStatus, Pending } from "@shared/pending";
import { NotFoundError } from "@server/features/common";

export class FinancialVirementsStore extends StoreBase {
  public get(projectId: string, pcrId: string, pcrItemId: string) {
    return this.getData("financialVirement", this.buildKey(projectId, pcrId, pcrItemId), p => ApiClient.financialVirements.get({ projectId, pcrItemId, pcrId, ...p }));
  }

  public getPartnerVirements(projectId: string, partnerId: string, pcrId: string, pcrItemId: string) {
    return this.get(projectId, pcrId, pcrItemId).chain((data, state) => {
      const partner = data.partners.find(x => x.partnerId === partnerId);
      return new Pending(partner ? state : LoadingStatus.Failed, partner, partner ? null : new NotFoundError("Could not find partner"));
    });
  }
}
