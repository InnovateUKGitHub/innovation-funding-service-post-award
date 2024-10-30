import { ForecastDetailsDTO } from "@framework/dtos/forecastDetailsDto";
import { IContext } from "@framework/types/IContext";
import { mapLatestForecastDetail } from "@server/features/forecastDetails/mapForecastDetail";
import { AuthorisedAsyncQueryBase } from "../common/queryBase";

export class GetAllForecastsForPartnerQuery extends AuthorisedAsyncQueryBase<ForecastDetailsDTO[]> {
  public readonly runnableName: string = "GetAllForecastsForPartnerQuery";
  constructor(private readonly partnerId: PartnerId) {
    super();
  }

  protected async run(context: IContext) {
    const results = await context.repositories.profileDetails.getAllByPartner(this.partnerId);
    return results.map(mapLatestForecastDetail(context));
  }
}
