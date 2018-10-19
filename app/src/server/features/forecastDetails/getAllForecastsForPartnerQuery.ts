import { IContext, IQuery } from "../common/context";
import { ForecastDetailsDTO } from "../../../ui/models/index";
import mapForecastDetail from "./mapForecastDetail";

export class GetAllForecastsForPartnerQuery implements IQuery<ForecastDetailsDTO[]> {
  constructor(
    private partnerId: string,
    private periodId: number
  ) {}

  public async Run(context: IContext) {
    const results = await context.repositories.profileDetails.getAllByPartnerWithPeriodGt(this.partnerId, this.periodId);
    return results.map(mapForecastDetail(context));
  }
}
