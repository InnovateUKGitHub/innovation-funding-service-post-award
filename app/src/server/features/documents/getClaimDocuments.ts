import { QueryBase } from "../common";
import { GetDocumentsLinkedToRecordQuery } from "./getAllForRecord";
import { IContext } from "../../../types";

export class GetClaimDocumentsQuery extends QueryBase<DocumentSummaryDto[]> {
  constructor(private readonly claimKey: ClaimKey, private readonly filter?: DocumentFilter) {
    super();
  }

  protected async Run(context: IContext) {
    const claim = await context.repositories.claims.get(this.claimKey.partnerId, this.claimKey.periodId);
    return context.runQuery(new GetDocumentsLinkedToRecordQuery(claim.Id, this.filter));
  }
}
