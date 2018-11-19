import {IContext, IQuery} from "../common/context";
import {GetDocumentsLinkedToRecordQuery} from "./getAllForRecord";
export class GetClaimDocumentsQuery implements IQuery<DocumentSummaryDto[]> {
  constructor(private claimKey: ClaimKey, public filter?: DocumentFilter) {
  }

  public async Run(context: IContext) {
    const claim = await context.repositories.claims.get(this.claimKey.partnerId, this.claimKey.periodId);
    return context.runQuery(new GetDocumentsLinkedToRecordQuery(claim.Id, this.filter));
  }
}
