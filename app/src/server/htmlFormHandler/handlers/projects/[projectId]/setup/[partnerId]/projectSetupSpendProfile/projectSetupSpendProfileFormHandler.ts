import { ILinkInfo } from "@framework/types/ILinkInfo";
import { IContext } from "@framework/types/IContext";
import { UpdateForecastParams } from "@ui/containers/pages/forecasts/updateForecast.page";
import { storeKeys } from "@ui/redux/stores/storeKeys";
import { GetAllInitialForecastsForPartnerQuery } from "@server/features/forecastDetails/getAllInitialForecastsForPartnerQuery";
import { InitialForecastDetailsDtosValidator } from "@ui/validation/validators/initialForecastDetailsDtosValidator";
import { GetCostCategoriesForPartnerQuery } from "@server/features/claims/getCostCategoriesForPartnerQuery";
import { IFormButton, StandardFormHandlerBase } from "@server/htmlFormHandler/formHandlerBase";
import { ForecastDetailsDTO } from "@framework/dtos/forecastDetailsDto";
import { UpdateInitialForecastDetailsCommand } from "@server/features/forecastDetails/updateInitialForecastDetailsCommand";
import { ProjectSetupRoute } from "@ui/containers/pages/projects/setup/projectSetup.page";
import {
  ProjectSetupSpendProfileParams,
  ProjectSetupSpendProfileRoute,
} from "@ui/containers/pages/projects/setup/projectSetupSpendProfile/projectSetupSpendProfile.page";
import { isNumber } from "@framework/util/numberHelper";
import { GetByIdQuery as GetPartnerByIdQuery } from "@server/features/partners/getByIdQuery";

// need to store isComplete in dto but as dto is an array the solution is to store isComplete on every entry
interface Dto extends ForecastDetailsDTO {
  isComplete: boolean;
}

export class ProjectSetupSpendProfileFormHandler extends StandardFormHandlerBase<
  ProjectSetupSpendProfileParams,
  "initialForecastDetails"
> {
  constructor() {
    super(ProjectSetupSpendProfileRoute, ["default"], "initialForecastDetails");
  }

  protected async getDto(
    context: IContext,
    params: UpdateForecastParams,
    button: IFormButton,
    body: { [key: string]: string },
  ): Promise<Dto[]> {
    const dto = await context.runQuery(new GetAllInitialForecastsForPartnerQuery(params.partnerId));
    const partner = await context.runQuery(new GetPartnerByIdQuery(params.partnerId));
    const costCategories = await context.runQuery(new GetCostCategoriesForPartnerQuery(partner));

    return dto
      .filter(x => costCategories.find(c => c.id === x.costCategoryId))
      .map(x => {
        const value = parseFloat(body[`value_${x.periodId}_${x.costCategoryId}`]);
        const costCategory = costCategories.find(c => c.id === x.costCategoryId);
        if (!costCategory) throw new Error(`Cannot find costCategory matching ${x.costCategoryId}`);
        // If it's calculated then we don't care if it's not valid so just set it to zero
        x.value = !isNumber(value) && costCategory.isCalculated ? 0 : value;
        return {
          ...x,
          isComplete: body.isComplete === "true",
        };
      });
  }

  protected async run(
    context: IContext,
    params: UpdateForecastParams,
    button: IFormButton,
    dto: Dto[],
  ): Promise<ILinkInfo> {
    // Can assume there is at least one profile detail and that isComplete is set to the same value on every profile detail
    const submit = dto[0].isComplete;
    await context.runCommand(new UpdateInitialForecastDetailsCommand(params.projectId, params.partnerId, dto, submit));
    return ProjectSetupRoute.getLink(params);
  }

  protected getStoreKey(params: UpdateForecastParams) {
    return storeKeys.getPartnerKey(params.partnerId);
  }

  protected createValidationResult(params: UpdateForecastParams, dto: Dto[]) {
    return new InitialForecastDetailsDtosValidator(dto, [], [], false, false);
  }
}
