import { Pending } from "@shared/pending";
import { ClaimDto } from "@framework/dtos";
import { apiClient } from "@ui/apiClient";
import { ClaimDtoValidator } from "@ui/validators";

import { StoreBase } from "@ui/redux/stores/storeBase";
import { storeKeys } from "@ui/redux/stores/storeKeys";
import { messageSuccess, RootActionsOrThunk } from "@ui/redux/actions";
import { RootState } from "@ui/redux/reducers";

import { ClaimDocumentsStore, CostSummariesStore, PartnersStore } from "@ui/redux/stores";

const periodsWithIARDue = (data: ClaimDto[]) =>
  data.reduce((acc: string[], cur: ClaimDto) => {
    if (cur.iarStatus === "Not Received" && cur.isIarRequired) {
      acc.push(cur.periodId.toString());
    }
    return acc;
  }, []) ?? [];

export class ClaimsStore extends StoreBase {
  constructor(
    private readonly costsSummariesStore: CostSummariesStore,
    private readonly claimDocumentsStore: ClaimDocumentsStore,
    private readonly partnersStore: PartnersStore,
    getState: () => RootState,
    queue: (action: RootActionsOrThunk) => void,
  ) {
    super(getState, queue);
  }

  private getClaimKey(partnerId: PartnerId, periodId: number) {
    return storeKeys.getClaimKey(partnerId, periodId);
  }

  public get(partnerId: PartnerId, periodId: number) {
    return this.getData("claim", this.getClaimKey(partnerId, periodId), p =>
      apiClient.claims.get({ partnerId, periodId, ...p }),
    );
  }

  public getAllClaimsForProject(projectId: ProjectId): Pending<ClaimDto[]> {
    return this.getData("claims", storeKeys.getProjectKey(projectId), p =>
      apiClient.claims.getAllByProjectId({ projectId, ...p }),
    ).then(
      data => data,
      () => [],
    );
  }

  public getInactiveClaimsForProject(projectId: ProjectId) {
    return this.getAllClaimsForProject(projectId).then(x => x.filter(claim => claim.isApproved));
  }

  public getActiveClaimsForProject(projectId: ProjectId) {
    return this.getAllClaimsForProject(projectId).then(x => x.filter(claim => !claim.isApproved));
  }

  public getAllClaimsForPartner(partnerId: PartnerId) {
    return this.getData("claims", storeKeys.getPartnerKey(partnerId), p =>
      apiClient.claims.getAllByPartnerId({ partnerId, ...p }),
    ).then(
      data => data,
      () => [],
    );
  }

  public getIARDueOnClaimPeriods(partnerId: PartnerId) {
    return this.getData("allClaimsIncludingNew", storeKeys.getPartnerKey(partnerId), p =>
      apiClient.claims.getAllIncludingNewByPartnerId({ partnerId, ...p }),
    ).then(periodsWithIARDue, () => []);
  }

  public getActiveClaimForPartner(partnerId: PartnerId) {
    return this.getAllClaimsForPartner(partnerId).then(x => x.find(y => !y.isApproved) || null);
  }

  public getInactiveClaimsForPartner(partnerId: PartnerId) {
    return this.getAllClaimsForPartner(partnerId).then(x => x.filter(y => y.isApproved) || null);
  }

  public markClaimAsStale(partnerId: PartnerId, periodId: number): void {
    this.markStale("claim", this.getClaimKey(partnerId, periodId), undefined);
  }

  public getClaimEditor(
    isClaimSummary: boolean,
    projectId: ProjectId,
    partnerId: PartnerId,
    periodId: number,
    init?: (dto: ClaimDto) => void,
  ) {
    return this.getEditor(
      "claim",
      this.getClaimKey(partnerId, periodId),
      () => this.get(partnerId, periodId),
      init,
      dto => this.validate(projectId, partnerId, periodId, dto, false, isClaimSummary),
    );
  }

  public updateClaimEditor(
    isClaimSummary: boolean,
    saving: boolean,
    projectId: ProjectId,
    partnerId: PartnerId,
    periodId: number,
    dto: ClaimDto,
    message?: string,
    onComplete?: (result: ClaimDto) => void,
  ): void {
    this.updateEditor(
      saving,
      "claim",
      this.getClaimKey(partnerId, periodId),
      dto,
      showErrors => this.validate(projectId, partnerId, periodId, dto, showErrors, isClaimSummary),
      p => apiClient.claims.update({ projectId, partnerId, periodId, claim: dto, ...p }),
      result => {
        this.markStale("claim", this.getClaimKey(partnerId, periodId), result);
        if (message) {
          this.queue(messageSuccess(message));
        }
        if (onComplete) {
          onComplete(result);
        }
      },
    );
  }

  private validate(
    projectId: ProjectId,
    partnerId: PartnerId,
    periodId: number,
    claim: ClaimDto,
    showErrors: boolean,
    isClaimSummary?: boolean,
  ) {
    const originalStatus = this.get(partnerId, periodId).then(x => x.status);
    const partners = this.partnersStore.getById(partnerId);
    const details = this.costsSummariesStore.getForPeriod(projectId, partnerId, periodId);
    const documents = this.claimDocumentsStore.getClaimDocuments(projectId, partnerId, periodId).data || [];

    const validatePendings = Pending.combine({
      originalStatus,
      details,
      partners,
    });

    return validatePendings.then(
      x =>
        new ClaimDtoValidator(
          claim,
          x.originalStatus,
          x.details,
          documents,
          showErrors,
          x.partners.competitionType,
          isClaimSummary,
        ),
    );
  }

  public getStatusChanges(projectId: ProjectId, partnerId: PartnerId, periodId: number) {
    return this.getData("claimStatusChanges", this.getClaimKey(partnerId, periodId), p =>
      apiClient.claims.getStatusChanges({ projectId, partnerId, periodId, ...p }),
    );
  }

  public getTotalCosts(projectId: ProjectId, partnerId: PartnerId, periodId: number) {
    return this.getData("claimTotalCosts", storeKeys.getClaimTotalCostsKey(partnerId, projectId, periodId), p =>
      apiClient.claims.getTotalCosts({ partnerId, projectId, periodId, ...p }),
    );
  }
}
