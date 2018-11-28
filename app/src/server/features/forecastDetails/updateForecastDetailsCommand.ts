import { CommandBase, IContext } from "../common/context";
import { ValidationError } from "../../../shared/validation";
import { GetAllForecastsGOLCostsQuery, GetCostCategoriesQuery } from "../claims";
import { ForecastDetailsDtosValidator } from "../../../ui/validators/forecastDetailsDtosValidator";
import { GetAllClaimDetailsByPartner } from "../claimDetails";
import { ISalesforceProfileDetails } from "../../repositories";
import { Updatable } from "../../repositories/salesforceBase";

export class UpdateForecastDetailsCommand extends CommandBase<boolean> {
  constructor(
    private partnerId: string,
    private periodId: number,
    private forecasts: ForecastDetailsDTO[]
  ) { 
    super();
  }

  protected async Run(context: IContext) {
    const claimDetails   = await context.runQuery(new GetAllClaimDetailsByPartner(this.partnerId));
    const golCosts       = await context.runQuery(new GetAllForecastsGOLCostsQuery(this.partnerId));
    const costCategories = await context.runQuery(new GetCostCategoriesQuery());
    const showErrors     = true;
    // TODO - period id needs to be resolved
    const validation     = new ForecastDetailsDtosValidator(this.periodId, this.forecasts, claimDetails, golCosts, costCategories, showErrors);

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
