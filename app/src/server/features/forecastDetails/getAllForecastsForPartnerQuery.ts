import { QueryBase } from "../common";
import { IContext } from "@framework/types";
import mapForecastDetail from "./mapForecastDetail";

export class GetAllForecastsForPartnerQuery extends QueryBase<ForecastDetailsDTO[]> {
  constructor(private readonly partnerId: string) {
    super();
  }

  protected async Run(context: IContext) {
    const results = await context.repositories.profileDetails.getAllByPartner(this.partnerId);
    return results.map(mapForecastDetail(context));
  }
}
