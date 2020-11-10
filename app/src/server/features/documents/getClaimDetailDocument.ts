import { Authorisation, ClaimDetailKey, IContext, ProjectRole } from "@framework/types";
import { DocumentQueryBase } from "./documentQueryBase";

export class GetClaimDetailDocumentQuery extends DocumentQueryBase {
  constructor(private readonly claimKey: ClaimDetailKey, documentId: string) {
    super(documentId);
  }

  protected async accessControl(auth: Authorisation, context: IContext) {
    return auth.forPartner(this.claimKey.projectId, this.claimKey.partnerId).hasAnyRoles(ProjectRole.FinancialContact, ProjectRole.ProjectManager)
    || auth.forProject(this.claimKey.projectId).hasRole(ProjectRole.MonitoringOfficer);
  }

  protected getRecordId(context: IContext): Promise<string | null> {
    return context.repositories.claimDetails.get(this.claimKey).then(x => x && x.Id);
  }
}
