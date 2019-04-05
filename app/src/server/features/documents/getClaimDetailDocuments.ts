import { QueryBase } from "../common";
import { GetDocumentsLinkedToRecordQuery } from "./getAllForRecord";
import { IContext } from "../../../types";

export class GetClaimDetailDocumentsQuery extends QueryBase<DocumentSummaryDto[]> {
  constructor(
    private readonly partnerId: string,
    private readonly periodId: number,
    private readonly costCategoryId: string
  ) {
    super();
  }

  protected async Run(context: IContext) {
    const key = {
      partnerId: this.partnerId,
      periodId: this.periodId,
      costCategoryId: this.costCategoryId
    };

    const claimDetail = await context.repositories.claimDetails.get(key);

    if (!claimDetail) {
      return [];
    }

    return context.runQuery(new GetDocumentsLinkedToRecordQuery(claimDetail.Id));
  }
}
