import {IContext, QueryBase} from "../common/context";
import {GetDocumentsLinkedToRecordQuery} from "./getAllForRecord";

export class GetClaimDocumentsQuery extends QueryBase<DocumentSummaryDto[]> {
  constructor(private claimKey: ClaimKey, public filter?: DocumentFilter) {
    super();
  }

  protected async Run(context: IContext) {
    const claim = await context.repositories.claims.get(this.claimKey.partnerId, this.claimKey.periodId);
    return context.runQuery(new GetDocumentsLinkedToRecordQuery(claim.Id, this.filter));
  }
}
