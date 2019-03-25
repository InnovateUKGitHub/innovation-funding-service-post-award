import { QueryBase } from "../common";
import { GetDocumentsLinkedToRecordQuery } from "./getAllForRecord";
import { IContext } from "../../../types";

export class GetProjectDocumentsQuery extends QueryBase<DocumentSummaryDto[]> {
  constructor(private readonly projectId: string) {
    super();
  }

  protected async Run(context: IContext) {
    return context.runQuery(new GetDocumentsLinkedToRecordQuery(this.projectId));
  }
}
