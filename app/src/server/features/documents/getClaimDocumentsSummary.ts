import { Authorisation, IContext, ProjectRole } from "@framework/types";
import { DocumentsSummaryQueryBase } from "./documentsSummaryQueryBase";
import { ISalesforceDocument } from "@server/repositories";

export class GetClaimDocumentsQuery extends DocumentsSummaryQueryBase {
  constructor(private readonly claimKey: ClaimKey, filter?: DocumentFilter) {
    super(filter);
  }

  protected async accessControl(auth: Authorisation, context: IContext) {
      return auth.forPartner(this.claimKey.projectId, this.claimKey.partnerId).hasRole(ProjectRole.FinancialContact)
        || auth.forProject(this.claimKey.projectId).hasAnyRoles(ProjectRole.MonitoringOfficer, ProjectRole.ProjectManager);
  }

  protected getRecordId(context: IContext): Promise<string> {
    return context.repositories.claims.get(this.claimKey.partnerId, this.claimKey.periodId).then(x => x.Id);
  }

  protected getUrl(document: ISalesforceDocument): string {
    return `/api/documents/claims/${this.claimKey.projectId}/${this.claimKey.partnerId}/${this.claimKey.periodId}/${document.Id}/content`;
  }
}
