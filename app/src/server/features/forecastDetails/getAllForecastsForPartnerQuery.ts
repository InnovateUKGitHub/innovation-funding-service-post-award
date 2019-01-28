import { QueryBase } from "../common/queryBase";
import mapForecastDetail from "./mapForecastDetail";
import { IContext } from "../../../types/IContext";

export class GetAllForecastsForPartnerQuery extends QueryBase<ForecastDetailsDTO[]> {
  constructor(private partnerId: string) {
    super();
  }

  protected async Run(context: IContext) {
    const results = await context.repositories.profileDetails.getAllByPartner(this.partnerId);
    return results.map(mapForecastDetail(context));
  }
}
