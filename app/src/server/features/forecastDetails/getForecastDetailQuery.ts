import { QueryBase } from "../common";
import { IContext } from "../../../types";
import mapForecastDetail from "./mapForecastDetail";

export class GetForecastDetailQuery extends QueryBase<ForecastDetailsDTO> {
  constructor(
    private readonly partnerId: string,
    private readonly periodId: number,
    private readonly costCategoryId: string
  ) {
    super();
  }

  protected async Run(context: IContext) {
    const result = await context.repositories.profileDetails.getById(this.partnerId, this.periodId, this.costCategoryId);

    return result && mapForecastDetail(context)(result) || {
      costCategoryId: this.costCategoryId,
      periodId: this.periodId,
      value: 0
    };
  }
}
