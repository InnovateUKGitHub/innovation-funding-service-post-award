import { QueryBase } from "../common/queryBase";
import mapForecastDetail from "./mapForecastDetail";
import { IContext } from "../../../types/IContext";

export class GetForecastDetailQuery extends QueryBase<ForecastDetailsDTO> {
  constructor(private partnerId: string, private periodId: number, private costCategoryId: string) {
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
