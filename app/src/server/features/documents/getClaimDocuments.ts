import { QueryBase } from "@server/features/common";
import { Authorisation, IContext, ProjectRole } from "@framework/types";
import { GetDocumentsLinkedToRecordQuery } from "@server/features/documents/getAllForRecord";

export class GetClaimDocumentsQuery extends QueryBase<DocumentSummaryDto[]> {
  constructor(private readonly claimKey: ClaimKey, private readonly filter?: DocumentFilter) {
    super();
  }

  protected async accessControl(auth: Authorisation, context: IContext) {
      return auth.forPartner(this.claimKey.projectId, this.claimKey.partnerId).hasRole(ProjectRole.FinancialContact)
        || auth.forProject(this.claimKey.projectId).hasRole(ProjectRole.MonitoringOfficer);
  }

  protected async Run(context: IContext) {
    const claim = await context.repositories.claims.get(this.claimKey.partnerId, this.claimKey.periodId);
    return context.runQuery(new GetDocumentsLinkedToRecordQuery(claim.Id, this.filter));
  }
}
