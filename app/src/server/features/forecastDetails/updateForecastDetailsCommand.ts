import {ICommand, IContext} from "../common/context";
import {ForecastDetailsDTO} from "../../../ui/models";
import {ValidationError} from "../../../shared/validation";
import { GetAllForecastsGOLCostsQuery, GetCostCategoriesQuery } from "../claims";
import { ForecastDetailsDtosValidator } from "../../../ui/validators/forecastDetailsDtosValidator";
import { GetAllClaimDetailsByPartner } from "../claims/claimDetails/getAllByPartnerQuery";
import { ISalesforceProfileDetails } from "../../repositories";
import { Updatable } from "../../repositories/salesforceBase";

export class UpdateForecastDetailsCommand implements ICommand<boolean> {
  constructor(
    private partnerId: string,
    private periodId: number,
    private forecasts: ForecastDetailsDTO[]
  ) { }

  public async Run(context: IContext) {
    const claimDetails   = await context.runQuery(new GetAllClaimDetailsByPartner(this.partnerId));
    const golCosts       = await context.runQuery(new GetAllForecastsGOLCostsQuery(this.partnerId));
    const costCategories = await context.runQuery(new GetCostCategoriesQuery());
    // TODO - period id needs to be resolved
    const validation     = new ForecastDetailsDtosValidator(this.periodId, this.forecasts, claimDetails, golCosts, costCategories);

    if (!validation.isValid) {
      throw new ValidationError(validation);
    }

    const updates = this.forecasts.map<Updatable<ISalesforceProfileDetails>>(x => ({
      Id: x.id,
      Acc_LatestForecastCost__c: x.value
    }));

    return await context.repositories.profileDetails.update(updates);
  }
}
