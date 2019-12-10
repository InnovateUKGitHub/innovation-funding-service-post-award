import { StoreBase } from "./storeBase";
import { ApiClient } from "@ui/apiClient";
import { ClaimDtoValidator } from "@ui/validators";
import { ClaimDto } from "@framework/dtos";
import { messageSuccess, RootActionsOrThunk } from "../actions";
import { RootState } from "../reducers";
import { CostSummariesStore } from "./costsSummariesStore";
import { CostCategoriesStore } from "./costCategoriesStore";
import { Pending } from "@shared/pending";
import { ClaimDocumentsStore } from "@ui/redux/stores/claimDocumentsStore";
import { storeKeys } from "@ui/redux/stores/storeKeys";

export class ClaimsStore extends StoreBase {
  constructor(private costsSummariesStore: CostSummariesStore, private costCategoriesStore: CostCategoriesStore, private claimDocumentsStore: ClaimDocumentsStore, getState: () => RootState, queue: (action: RootActionsOrThunk) => void) {
    super(getState, queue);
  }

  private getKey(partnerId: string, periodId: number) {
    return storeKeys.getClaimKey(partnerId, periodId);
  }

  public get(partnerId: string, periodId: number) {
    return this.getData("claim", this.getKey(partnerId, periodId), p => ApiClient.claims.get({ partnerId, periodId, ...p }));
  }

  public getAllClaimsForProject(projectId: string): Pending<ClaimDto[]> {
    return this.getData("claims", storeKeys.getProjectKey(projectId), p => ApiClient.claims.getAllByProjectId({ projectId, ...p }))
      .then(data => data, () => []);
  }

  public getInactiveClaimsForProject(projectId: string) {
    return this.getAllClaimsForProject(projectId).then(x => x.filter(claim => claim.isApproved));
  }

  public getActiveClaimsForProject(projectId: string) {
    return this.getAllClaimsForProject(projectId).then(x => x.filter(claim => !claim.isApproved));
  }

  public getAllClaimsForPartner(partnerId: string) {
    return this.getData("claims", storeKeys.getPartnerKey(partnerId), p => ApiClient.claims.getAllByPartnerId({ partnerId, ...p }))
      .then(data => data, () => []);
  }

  public getActiveClaimForPartner(partnerId: string) {
    return this.getAllClaimsForPartner(partnerId).then(x => x.find(y => !y.isApproved) || null);
  }

  public getInactiveClaimsForPartner(partnerId: string) {
    return this.getAllClaimsForPartner(partnerId).then(x => x.filter(y => y.isApproved) || null);
  }

  public getClaimEditor(projectId: string, partnerId: string, periodId: number, init?: (dto: ClaimDto) => void) {
    return this.getEditor(
      "claim",
      this.getKey(partnerId, periodId),
      () => this.get(partnerId, periodId),
      init,
      (dto) => this.validate(projectId, partnerId, periodId, dto, false)
    );
  }

  public updateClaimEditor(saving: boolean, projectId: string, partnerId: string, periodId: number, dto: ClaimDto, message?: string, onComplete?: (result: ClaimDto) => void): void {
    this.updateEditor(
      saving,
      "claim",
      this.getKey(partnerId, periodId),
      dto,
      showErrors =>  this.validate(projectId, partnerId, periodId, dto, showErrors),
      p => ApiClient.claims.update({projectId, partnerId, periodId, claim: dto, ...p}),
      result => {
        this.markStale("claim", this.getKey(partnerId, periodId), result);
        if (message) {
          this.queue(messageSuccess(message));
        }
        if(onComplete) {
          onComplete(result);
        }
      });
  }

  private validate(projectId: string, partnerId: string, periodId: number, claim: ClaimDto, showErrors: boolean) {
    const originalStatus = this.get(partnerId, periodId).then(x => x.status);
    const details = this.costsSummariesStore.getForPeriod(projectId, partnerId, periodId);
    const documents = this.claimDocumentsStore.getClaimDocuments(projectId, partnerId, periodId).data || [];
    const costCategories = this.costCategoriesStore.getAll();

    return Pending.combine({
      originalStatus,
      details,
      costCategories
    }).then(x => new ClaimDtoValidator(claim, x.originalStatus, x.details, x.costCategories, documents, showErrors));
  }

  public getStatusChanges(projectId: string, partnerId: string, periodId: number) {
    return this.getData("claimStatusChanges", this.getKey(partnerId, periodId), p => ApiClient.claims.getStatusChanges({ projectId, partnerId, periodId, ...p }));
  }

}
