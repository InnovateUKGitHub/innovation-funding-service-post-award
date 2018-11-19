import {IContext, IQuery} from "../common/context";
import {GetDocumentsLinkedToRecordQuery} from "./getAllForRecord";

export class GetClaimDocumentsQuery implements IQuery<DocumentSummaryDto[]> {
  constructor(private partnerId: string, private periodId: number, private description: string) {
  }

  public async Run(context: IContext) {
    const claim = await context.repositories.claims.get(this.partnerId, this.periodId);
    return context.runQuery(new GetDocumentsLinkedToRecordQuery(claim.Id, this.description));
  }
}
