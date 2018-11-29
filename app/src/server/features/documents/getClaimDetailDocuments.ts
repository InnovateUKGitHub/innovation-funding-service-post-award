import {IContext, QueryBase} from "../common/context";
import {GetDocumentsLinkedToRecordQuery} from "./getAllForRecord";

export class GetClaimDetailDocumentsQuery extends QueryBase<DocumentSummaryDto[]> {
  constructor(public partnerId: string, public periodId: number, public costCategoryId: string) {
    super();
  }

  protected async Run(context: IContext) {
    const key = {
      partnerId: this.partnerId,
      periodId: this.periodId,
      costCategoryId: this.costCategoryId
    };
    const claimDetail = await context.repositories.claimDetails.get(key);
    return context.runQuery(new GetDocumentsLinkedToRecordQuery(claimDetail.Id));
  }
}
