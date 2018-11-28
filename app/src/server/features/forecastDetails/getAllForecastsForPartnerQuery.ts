import { IContext, QueryBase } from "../common/context";
import mapForecastDetail from "./mapForecastDetail";

export class GetAllForecastsForPartnerQuery extends QueryBase<ForecastDetailsDTO[]> {
  constructor(
    private partnerId: string,
    private periodId: number
  ) {
    super();
  }

  protected async Run(context: IContext) {
    const results = await context.repositories.profileDetails.getAllByPartnerWithPeriodGt(this.partnerId, this.periodId);
    return results.map(mapForecastDetail(context));
  }
}
