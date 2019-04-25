import { QueryBase } from "@server/features/common";
import { Authorisation, IContext, ProjectRole } from "@framework/types";
import { GetDocumentsLinkedToRecordQuery } from "@server/features/documents/getAllForRecord";

export class GetProjectDocumentsQuery extends QueryBase<DocumentSummaryDto[]> {
  constructor(private readonly projectId: string) {
    super();
  }

  protected async accessControl(auth: Authorisation, context: IContext) {
    return context.config.features.projectDocuments && auth.forProject(this.projectId).hasRole(ProjectRole.MonitoringOfficer);
  }

  protected async Run(context: IContext) {
    return context.runQuery(new GetDocumentsLinkedToRecordQuery(this.projectId));
  }
}
