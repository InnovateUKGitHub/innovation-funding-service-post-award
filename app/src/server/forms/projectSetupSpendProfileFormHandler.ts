import { ILinkInfo } from "@framework/types/ILinkInfo";
import { IFormButton, StandardFormHandlerBase } from "./formHandlerBase";
import { UpdateInitialForecastDetailsCommand } from "../features/forecastDetails";
import { GetByIdQuery } from "../features/projects";
import { IContext } from "@framework/types/IContext";
import { GetByIdQuery as GetPartnerByIdQuery } from "../features/partners";
import { GetCostCategoriesForPartnerQuery } from "../features/claims/getCostCategoriesForPartnerQuery";
import { Params } from "@ui/containers/forecasts/update";
import { storeKeys } from "@ui/redux/stores/storeKeys";
import { ProjectSetupRoute, ProjectSetupSpendProfileParams, ProjectSetupSpendProfileRoute } from "@ui/containers";
import { GetAllInitialForecastsForPartnerQuery } from "@server/features/forecastDetails/getAllInitialForecastsForPartnerQuery";
import { InitialForecastDetailsDtosValidator } from "@ui/validators/initialForecastDetailsDtosValidator";
import { isNumber } from "@framework/util";
import { ForecastDetailsDTO } from "@framework/dtos";

// need to store isComplete in dto but as dto is an array the solution is to store isComplete on every entry
interface Dto extends ForecastDetailsDTO {
  isComplete: boolean;
}

export class ProjectSetupSpendProfileFormHandler extends StandardFormHandlerBase<ProjectSetupSpendProfileParams, "initialForecastDetails"> {

  constructor() {
    super(ProjectSetupSpendProfileRoute, ["default"], "initialForecastDetails");
  }

  protected async getDto(context: IContext, params: Params, button: IFormButton, body: { [key: string]: string; }): Promise<Dto[]> {
    const dto = await context.runQuery(new GetAllInitialForecastsForPartnerQuery(params.partnerId));
    const project = await context.runQuery(new GetByIdQuery(params.projectId));
    const partner = await context.runQuery(new GetPartnerByIdQuery(params.partnerId));
    const costCategories = await context.runQuery(new GetCostCategoriesForPartnerQuery(project, partner));

    return dto
      .filter(x => costCategories.find(c => c.id === x.costCategoryId))
      .map(x => {
        const value = parseFloat(body[`value_${x.periodId}_${x.costCategoryId}`]);
        const costCategory = costCategories.find(c => c.id === x.costCategoryId)!;
        // If it's calculated then we don't care if it's not valid so just set it to zero
        x.value = !isNumber(value) && costCategory.isCalculated ? 0 : value;
        return {
          ...x,
          isComplete: body.isComplete === "true"
        };
      });
  }

  protected async run(context: IContext, params: Params, button: IFormButton, dto: Dto[]): Promise<ILinkInfo> {
    // Can assume there is at least one profile detail and that isComplete is set to the same value on every profile detail
    const submit = dto[0].isComplete;
    await context.runCommand(new UpdateInitialForecastDetailsCommand(params.projectId, params.partnerId, dto, submit));
    return ProjectSetupRoute.getLink(params);
  }

  protected getStoreKey(params: Params) {
    return storeKeys.getPartnerKey(params.partnerId);
  }

  protected createValidationResult(params: Params, dto: Dto[]) {
    return new InitialForecastDetailsDtosValidator(dto, [], [], false, false);
  }
}
