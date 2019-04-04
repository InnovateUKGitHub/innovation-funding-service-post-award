import { QueryBase } from "../common";
import { GetDocumentsLinkedToRecordQuery } from "./getAllForRecord";
import { Authorisation, IContext, ProjectRole } from "../../../types";

export class GetProjectDocumentsQuery extends QueryBase<DocumentSummaryDto[]> {
  constructor(private readonly projectId: string) {
    super();
  }

  protected async accessControl(auth: Authorisation, context: IContext) {
    return context.config.features.projectDocuments && auth.for(this.projectId).hasRole(ProjectRole.MonitoringOfficer);
  }

  protected async Run(context: IContext) {
    return context.runQuery(new GetDocumentsLinkedToRecordQuery(this.projectId));
  }
}
