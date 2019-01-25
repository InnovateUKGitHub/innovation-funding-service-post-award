import {QueryBase} from "../common/queryBase";
import {GetDocumentsLinkedToRecordQuery} from "./getAllForRecord";
import { IContext } from "../../../types/IContext";

export class GetClaimDocumentsQuery extends QueryBase<DocumentSummaryDto[]> {
  constructor(private claimKey: ClaimKey, public filter?: DocumentFilter) {
    super();
  }

  protected async Run(context: IContext) {
    const claim = await context.repositories.claims.get(this.claimKey.partnerId, this.claimKey.periodId);
    return context.runQuery(new GetDocumentsLinkedToRecordQuery(claim.Id, this.filter));
  }
}
