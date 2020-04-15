import { QueryBase } from "../common";
import { IContext } from "@framework/types";
import { mapInitialForecastDetail } from "@server/features/forecastDetails/mapForecastDetail";

export class GetAllInitialForecastsForPartnerQuery extends QueryBase<ForecastDetailsDTO[]> {
  constructor(private readonly partnerId: string) {
    super();
  }

  protected async Run(context: IContext) {
    const results = await context.repositories.profileDetails.getAllByPartner(this.partnerId);
    return results.map(mapInitialForecastDetail(context));
  }
}
