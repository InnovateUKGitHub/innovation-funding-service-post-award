import { ForecastDetailsDTO, IContext } from "@framework/types";
import { mapLatestForecastDetail } from "@server/features/forecastDetails/mapForecastDetail";
import { QueryBase } from "../common";

export class GetForecastDetailQuery extends QueryBase<ForecastDetailsDTO> {
  constructor(
    private readonly partnerId: string,
    private readonly periodId: number,
    private readonly costCategoryId: string,
  ) {
    super();
  }

  protected async run(context: IContext) {
    const result = await context.repositories.profileDetails.getById(
      this.partnerId,
      this.periodId,
      this.costCategoryId,
    );

    return (
      (result && mapLatestForecastDetail(context)(result)) || {
        costCategoryId: this.costCategoryId,
        periodId: this.periodId,
        value: 0,
      }
    );
  }
}
