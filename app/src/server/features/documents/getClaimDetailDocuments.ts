import { QueryBase } from "@server/features/common";
import { IContext, Authorisation, ProjectRole } from "@framework/types";
import { GetDocumentsLinkedToRecordQuery } from "@server/features/documents/getAllForRecord";

export class GetClaimDetailDocumentsQuery extends QueryBase<DocumentSummaryDto[]> {
  constructor(
    private readonly projectId: string,
    private readonly partnerId: string,
    private readonly periodId: number,
    private readonly costCategoryId: string
  ) {
    super();
  }

  protected async accessControl(auth: Authorisation) {
    return auth.forProject(this.projectId).hasRole(ProjectRole.MonitoringOfficer)
    || auth.forPartner(this.projectId, this.partnerId).hasAnyRoles(ProjectRole.FinancialContact, ProjectRole.ProjectManager);
  }

  protected async Run(context: IContext) {
    const key = {
      projectId: this.projectId,
      partnerId: this.partnerId,
      periodId: this.periodId,
      costCategoryId: this.costCategoryId
    };

    const claimDetail = await context.repositories.claimDetails.get(key);

    if (!claimDetail) {
      return [];
    }

    return context.runQuery(new GetDocumentsLinkedToRecordQuery(claimDetail.Id));
  }
}
