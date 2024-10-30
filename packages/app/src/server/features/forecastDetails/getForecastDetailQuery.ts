import { ForecastDetailsDTO } from "@framework/dtos/forecastDetailsDto";
import { IContext } from "@framework/types/IContext";
import { mapLatestForecastDetail } from "@server/features/forecastDetails/mapForecastDetail";
import { AuthorisedAsyncQueryBase } from "../common/queryBase";

export class GetForecastDetailQuery extends AuthorisedAsyncQueryBase<ForecastDetailsDTO> {
  public readonly runnableName: string = "GetForecastDetailQuery";
  constructor(
    private readonly partnerId: PartnerId,
    private readonly periodId: number,
    private readonly costCategoryId: CostCategoryId,
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
