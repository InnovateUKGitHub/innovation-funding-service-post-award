import { QueryBase } from "@server/features/common";
import { IContext } from "@framework/types";
import { GetDocumentsLinkedToRecordQuery } from "@server/features/documents/getAllForRecord";

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
