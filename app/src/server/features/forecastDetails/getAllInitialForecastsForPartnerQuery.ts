import { ForecastDetailsDTO, IContext } from "@framework/types";
import { mapInitialForecastDetail } from "@server/features/forecastDetails/mapForecastDetail";
import { QueryBase } from "../common";

export class GetAllInitialForecastsForPartnerQuery extends QueryBase<ForecastDetailsDTO[]> {
  constructor(private readonly partnerId: PartnerId) {
    super();
  }

  protected async run(context: IContext) {
    const results = await context.repositories.profileDetails.getAllByPartner(this.partnerId);
    return results.map(mapInitialForecastDetail(context));
  }
}
