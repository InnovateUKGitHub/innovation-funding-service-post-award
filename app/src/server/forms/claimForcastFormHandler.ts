import { FormHandlerBase, IFormBody, IFormButton } from "./formHandlerBase";
import { ClaimDto, ClaimStatus } from "../../types";
import { Params as ClaimForcastFormParams } from "../../ui/containers/claims/forecasts/common";
import { IContext } from "../features/common/context";
import { Results } from "../../ui/validation/results";
import { ClaimForcastParams, ClaimForecastRoute, ClaimsDashboardRoute } from "../../ui/containers";
import { getForecastDetailsEditor } from "../../ui/redux/selectors";
import { ForecastDetailsDtosValidator } from "../../ui/validators";
import { GetAllForecastsForPartnerQuery, UpdateForecastDetailsCommand } from "../features/forecastDetails";
import { GetByIdQuery } from "../features/projects";
import { GetCostCategoriesQuery } from "../features/claims";

export class ClaimForcastFormHandler extends FormHandlerBase<ClaimForcastParams, ForecastDetailsDTO[]> {

  constructor() {
    super(ClaimForecastRoute, ["save", "default"]);
  }

  protected async getDto(context: IContext, params: ClaimForcastParams, button: string, body: { [key: string]: string; }): Promise<ForecastDetailsDTO[]> {
    const dto = await context.runQuery(new GetAllForecastsForPartnerQuery(params.partnerId));
    const project = (await context.runQuery(new GetByIdQuery(params.projectId)))!;
    const costCategories = await context.runQuery(new GetCostCategoriesQuery());
    
    const costCategoriesIdsToUpdate = costCategories
      .filter(x => !x.isCalculated)
      .filter(x => x.organistionType === "Industrial")
      .map(x => x.id);

    dto.forEach(x => {
        if (x.periodId > project.periodId && costCategoriesIdsToUpdate.indexOf(x.costCategoryId) >= 0) {
            x.value = parseFloat(body[`value_${x.periodId}_${x.costCategoryId}`]);
        }
    });
    
    return dto;
  }

  protected async run(context: IContext, params: ClaimForcastParams, button: string, dto: ForecastDetailsDTO[]): Promise<ILinkInfo> {
    const submit = button === "default";
    await context.runCommand(new UpdateForecastDetailsCommand(params.partnerId, dto, submit));
    return ClaimsDashboardRoute.getLink(params);
  }

  protected getStoreInfo(params: ClaimForcastParams): { key: string; store: string; } {
    return getForecastDetailsEditor(params.partnerId);
  }

  protected createValidationResult(params: ClaimForcastParams, dto: ForecastDetailsDTO[]): Results<ForecastDetailsDTO[]> {
    return new ForecastDetailsDtosValidator (dto, [], [], [], false);
  }

}
