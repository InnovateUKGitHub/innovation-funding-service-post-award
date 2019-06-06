import { QueryBase } from "@server/features/common";
import { Authorisation, IContext, ProjectRole } from "@framework/types";
import { GetDocumentsLinkedToRecordQuery } from "@server/features/documents/getAllForRecord";
import { DocumentsQueryBase } from "./documentsQueryBase";
import { ISalesforceDocument } from "@server/repositories";

export class GetClaimDocumentsQuery extends DocumentsQueryBase {
  constructor(private readonly claimKey: ClaimKey, private readonly filter?: DocumentFilter) {
    super();
  }

  protected async accessControl(auth: Authorisation, context: IContext) {
      return auth.forPartner(this.claimKey.projectId, this.claimKey.partnerId).hasRole(ProjectRole.FinancialContact)
        || auth.forProject(this.claimKey.projectId).hasRole(ProjectRole.MonitoringOfficer);
  }

  protected async Run(context: IContext) {
    const claim = await context.repositories.claims.get(this.claimKey.partnerId, this.claimKey.periodId);
    return super.getDocumentsForEntityId(context, claim.Id, this.filter);
  }

  getUrl(document: ISalesforceDocument): string {
    return `/api/documents/claims/${this.claimKey.projectId}/${this.claimKey.partnerId}/${this.claimKey.periodId}/${document.Id}/content`;
  }
}
