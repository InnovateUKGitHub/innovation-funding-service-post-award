import { IContext, ILinkInfo, PCRDto, PCRItemForPartnerAdditionDto, ProjectDto, ProjectRole } from "@framework/types";
import { BadRequestError, Configuration } from "@server/features/common";
import { GetPCRByIdQuery } from "@server/features/pcrs/getPCRByIdQuery";
import { UpdatePCRCommand } from "@server/features/pcrs/updatePcrCommand";
import { IFormBody, IFormButton, StandardFormHandlerBase } from "@server/forms/formHandlerBase";
import {
  PcrEditSpendProfileCostParams,
  PCRPrepareSpendProfileCostsRoute,
  PCRSpendProfileEditCostRoute
} from "@ui/containers";
import { PCRDtoValidator } from "@ui/validators";
import { PCRItemStatus } from "@framework/constants";
import { storeKeys } from "@ui/redux/stores/storeKeys";
import { GetCostCategoriesQuery } from "@server/features/claims";
import { CostCategoryType } from "@framework/entities";
import { PCRSpendProfileLabourCostDto } from "@framework/dtos/pcrSpendProfileDto";
import { isNumber } from "@framework/util";

export class ProjectChangeRequestSpendProfileEditCostHandler extends StandardFormHandlerBase<PcrEditSpendProfileCostParams, "pcr"> {
  constructor() {
    super(PCRSpendProfileEditCostRoute, ["default"], "pcr");
  }

  protected async getDto(context: IContext, params: PcrEditSpendProfileCostParams, button: IFormButton, body: IFormBody): Promise<PCRDto> {
    if (!body.id) {
      throw new BadRequestError("Cost not found");
    }
    const dto = await context.runQuery(new GetPCRByIdQuery(params.projectId, params.pcrId));

    const item = dto.items.find(x => x.id === params.itemId) as PCRItemForPartnerAdditionDto;

    if (!item) {
      throw new BadRequestError();
    }

    item.status = body.itemStatus === "true" ? PCRItemStatus.Complete : PCRItemStatus.Incomplete;

    const costCategories = await context.runQuery(new GetCostCategoriesQuery());
    const costCategory = costCategories.find(x => x.id === params.costCategoryId);

    if (!costCategory) {
      throw new BadRequestError("Unknown cost category");
    }

    const cost = item.spendProfile.costs.find(x => x.id === body.id && x.costCategoryId === params.costCategoryId);

    if (!cost) {
      throw new BadRequestError("Cost not found");
    }
    // tslint:disable-next-line:no-small-switch
    switch (costCategory.type) {
      case CostCategoryType.Labour:
        this.updateLabourCost(cost as PCRSpendProfileLabourCostDto, body);
        break;
    }
    return dto;
  }

  private updateLabourCost(cost: PCRSpendProfileLabourCostDto,  body: IFormBody) {
    const daysSpentOnProject = body.daysSpentOnProject ? Number(body.daysSpentOnProject) : null;
    const ratePerDay = body.ratePerDay ? Number(body.ratePerDay) : null;

    cost.daysSpentOnProject = daysSpentOnProject;
    cost.ratePerDay = ratePerDay;
    cost.value = isNumber(daysSpentOnProject) && isNumber(ratePerDay) ? daysSpentOnProject * ratePerDay : null;
    cost.role = body.role;
    cost.grossCostOfRole = body.grossCostOfRole ? Number(body.grossCostOfRole) : null;
  }

  protected async run(context: IContext, params: PcrEditSpendProfileCostParams, button: IFormButton, dto: PCRDto): Promise<ILinkInfo> {
    await context.runCommand(new UpdatePCRCommand(params.projectId, params.pcrId, dto));

    return PCRPrepareSpendProfileCostsRoute.getLink({
      projectId: params.projectId,
      pcrId: params.pcrId,
      itemId: params.itemId,
      costCategoryId: params.costCategoryId
    });
  }

  protected getStoreKey(params: PcrEditSpendProfileCostParams) {
    return storeKeys.getPcrKey(params.projectId, params.pcrId);
  }

  protected createValidationResult(params: PcrEditSpendProfileCostParams, dto: PCRDto) {
    return new PCRDtoValidator(dto, ProjectRole.Unknown, [], false, {} as ProjectDto, Configuration.features, dto);
  }
}
