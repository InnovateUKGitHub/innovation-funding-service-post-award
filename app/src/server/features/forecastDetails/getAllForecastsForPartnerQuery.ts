import { ForecastDetailsDTO, IContext } from "@framework/types";
import { mapLatestForecastDetail } from "@server/features/forecastDetails/mapForecastDetail";
import { QueryBase } from "../common";

export class GetAllForecastsForPartnerQuery extends QueryBase<ForecastDetailsDTO[]> {
  constructor(private readonly partnerId: string) {
    super();
  }

  protected async Run(context: IContext) {
    const results = await context.repositories.profileDetails.getAllByPartner(this.partnerId);
    return results.map(mapLatestForecastDetail(context));
  }
}
