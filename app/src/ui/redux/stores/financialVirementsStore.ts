import { StoreBase } from "./storeBase";
import { ApiClient } from "@ui/apiClient";

export class FinancialVirementsStore extends StoreBase {
  public get(projectId: string, pcrId: string, pcrItemId: string) {
    return this.getData("financialVirement", this.buildKey(projectId, pcrId, pcrItemId), p => ApiClient.financialVirements.get({projectId, pcrItemId, pcrId, ...p}));
  }
}
