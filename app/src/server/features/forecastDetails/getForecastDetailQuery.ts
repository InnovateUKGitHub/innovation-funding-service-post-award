import {IContext, IQuery} from "../common/context";
import {ForecastDetailsDTO} from "../../../ui/models";
import mapForecastDetail from "./mapForecastDetail";

export class GetForecastDetail implements IQuery<ForecastDetailsDTO> {
  constructor(private partnerId: string,
              private periodId: number,
              private costCategoryId: string,) {
  }

  public async Run(context: IContext) {
    const result = await context.repositories.profileDetails.getById(this.partnerId, this.periodId, this.costCategoryId);
    return result && mapForecastDetail(context)(result);
  }
}
