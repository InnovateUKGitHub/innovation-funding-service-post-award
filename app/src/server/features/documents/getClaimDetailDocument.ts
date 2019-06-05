import { QueryBase } from "@server/features/common";
import { Authorisation, IContext, ProjectRole } from "@framework/types";
import { DocumentQueryBase } from "./documentQueryBase";

export class GetClaimDetailDocumentQuery extends DocumentQueryBase {
  constructor(private readonly claimKey: ClaimDetailKey, documentId: string) {
    super(documentId);
  }

  protected async accessControl(auth: Authorisation, context: IContext) {
    return auth.forPartner(this.claimKey.projectId, this.claimKey.partnerId).hasRole(ProjectRole.FinancialContact)
    || auth.forProject(this.claimKey.projectId).hasRole(ProjectRole.MonitoringOfficer);
  }

  protected getRecordId(context: IContext): Promise<string | null> {
    return context.repositories.claimDetails.get(this.claimKey).then(x => x && x.Id);
  }
}
