import { ProjectRole } from "@framework/constants/project";
import { DocumentEntity } from "@framework/entities/document";
import { Authorisation } from "@framework/types/authorisation";
import { IContext } from "@framework/types/IContext";
import { DocumentsSummaryQueryBase } from "./documentsSummaryQueryBase";

export class GetClaimDetailDocumentsQuery extends DocumentsSummaryQueryBase {
  constructor(
    private readonly projectId: ProjectId,
    private readonly partnerId: PartnerId,
    private readonly periodId: number,
    private readonly costCategoryId: string,
  ) {
    super();
  }

  protected async accessControl(auth: Authorisation): Promise<boolean> {
    return (
      auth.forProject(this.projectId).hasAnyRoles(ProjectRole.MonitoringOfficer) ||
      auth
        .forPartner(this.projectId, this.partnerId)
        .hasAnyRoles(ProjectRole.FinancialContact, ProjectRole.ProjectManager)
    );
  }

  protected getRecordId(context: IContext): Promise<string | null> {
    const key = {
      projectId: this.projectId,
      partnerId: this.partnerId,
      periodId: this.periodId,
      costCategoryId: this.costCategoryId,
    };

    return context.repositories.claimDetails.get(key).then(x => x && x.Id);
  }

  protected getUrl(document: DocumentEntity): string {
    return `/api/documents/claim-details/${this.projectId}/${this.partnerId}/${this.periodId}/${this.costCategoryId}/${document.id}/content`;
  }
}
