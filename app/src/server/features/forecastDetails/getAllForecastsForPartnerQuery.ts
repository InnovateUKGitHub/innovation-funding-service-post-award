import { IContext, QueryBase } from "../common/context";
import mapForecastDetail from "./mapForecastDetail";

export class GetAllForecastsForPartnerQuery extends QueryBase<ForecastDetailsDTO[]> {
  constructor(private partnerId: string) {
    super();
  }

  protected async Run(context: IContext) {
    const results = await context.repositories.profileDetails.getAllByPartner(this.partnerId);
    return results.map(mapForecastDetail(context));
  }
}
