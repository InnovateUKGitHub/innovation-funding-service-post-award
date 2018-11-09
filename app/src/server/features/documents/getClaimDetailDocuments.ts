import {IContext, IQuery} from "../common/context";
import {GetDocumentsLinkedToRecordQuery} from "./getAllForRecord";

export class GetClaimDetailDocumentsQuery implements IQuery<DocumentSummaryDto[]> {
  constructor(public partnerId: string, public periodId: number, public costCategoryId: string) {
  }

  public async Run(context: IContext) {
    const key = {
      partnerId: this.partnerId,
      periodId: this.periodId,
      costCategoryId: this.costCategoryId
    };
    const claimDetail = await context.repositories.claimDetails.get(key);
    return context.runQuery(new GetDocumentsLinkedToRecordQuery(claimDetail.Id));
  }
}
