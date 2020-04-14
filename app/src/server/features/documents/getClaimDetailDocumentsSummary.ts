import { Authorisation, IContext, ProjectRole } from "@framework/types";
import { DocumentsSummaryQueryBase } from "./documentsSummaryQueryBase";
import { DocumentEntity } from "@framework/entities/document";

export class GetClaimDetailDocumentsQuery extends DocumentsSummaryQueryBase {
  constructor(
    private readonly projectId: string,
    private readonly partnerId: string,
    private readonly periodId: number,
    private readonly costCategoryId: string
  ) {
    super();
  }

  protected async accessControl(auth: Authorisation) {
    return auth.forProject(this.projectId).hasAnyRoles(ProjectRole.MonitoringOfficer)
      || auth.forPartner(this.projectId, this.partnerId).hasAnyRoles(ProjectRole.FinancialContact, ProjectRole.ProjectManager);
  }

  protected getRecordId(context: IContext) {
    const key = {
      projectId: this.projectId,
      partnerId: this.partnerId,
      periodId: this.periodId,
      costCategoryId: this.costCategoryId
    };

    return context.repositories.claimDetails.get(key).then(x => x && x.Id);
  }

  protected getUrl(document: DocumentEntity) {
    return `/api/documents/claim-details/${this.projectId}/${this.partnerId}/${this.periodId}/${this.costCategoryId}/${document.id}/content`;
  }
}
