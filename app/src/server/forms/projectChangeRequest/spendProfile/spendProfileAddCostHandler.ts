import { IContext, ILinkInfo, PCRDto, PCRItemForPartnerAdditionDto, ProjectDto, ProjectRole } from "@framework/types";
import { BadRequestError, Configuration } from "@server/features/common";
import { GetPCRByIdQuery } from "@server/features/pcrs/getPCRByIdQuery";
import { UpdatePCRCommand } from "@server/features/pcrs/updatePcrCommand";
import { IFormBody, IFormButton, StandardFormHandlerBase } from "@server/forms/formHandlerBase";
import {
  PcrAddSpendProfileCostParams,
  PCRSpendProfileAddCostRoute,
  PCRSpendProfileCostsSummaryRoute
} from "@ui/containers";
import { PCRDtoValidator } from "@ui/validators";
import { PCRItemStatus } from "@framework/constants";
import { storeKeys } from "@ui/redux/stores/storeKeys";
import { GetCostCategoriesQuery } from "@server/features/claims";
import { CostCategoryType } from "@framework/entities";
import { PCRSpendProfileLabourCostDto, PCRSpendProfileMaterialsCostDto } from "@framework/dtos/pcrSpendProfileDto";
import { isNumber } from "@framework/util";
import { CostCategoryDto } from "@framework/dtos/costCategoryDto";

export class ProjectChangeRequestSpendProfileAddCostHandler extends StandardFormHandlerBase<PcrAddSpendProfileCostParams, "pcr"> {
  constructor() {
    super(PCRSpendProfileAddCostRoute, ["default"], "pcr");
  }

  protected async getDto(context: IContext, params: PcrAddSpendProfileCostParams, button: IFormButton, body: IFormBody): Promise<PCRDto> {
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

    const cost = this.getCost(costCategory, params, body);
    if (cost) item.spendProfile.costs.push(cost);

    return dto;
  }

  private getCost(costCategory: CostCategoryDto, params: PcrAddSpendProfileCostParams, body: IFormBody) {
    const baseCostDto = {
      id: "",
      costCategoryId: params.costCategoryId
    };
    switch (costCategory.type) {
      case CostCategoryType.Labour: return this.getLabourCost(baseCostDto, costCategory.type, body);
      case CostCategoryType.Materials: return this.getMaterialsCost(baseCostDto, costCategory.type, body);
    }
  }

  private getLabourCost(baseCostDto: {id: string, costCategoryId: string}, costCategory: CostCategoryType.Labour, body: IFormBody): PCRSpendProfileLabourCostDto {
    const daysSpentOnProject = body.daysSpentOnProject ? Number(body.daysSpentOnProject) : null;
    const ratePerDay = body.ratePerDay ? Number(body.ratePerDay) : null;
    const value = isNumber(daysSpentOnProject) && isNumber(ratePerDay) ? daysSpentOnProject * ratePerDay : null;

    return {
      ...baseCostDto,
      costCategory,
      description: body.description,
      grossCostOfRole: body.grossCostOfRole ? Number(body.grossCostOfRole) : null,
      daysSpentOnProject,
      ratePerDay,
      value,
    };
  }

  private getMaterialsCost(baseCostDto: { id: string, costCategoryId: string }, costCategory: CostCategoryType.Materials, body: IFormBody): PCRSpendProfileMaterialsCostDto {
    const costPerItem = body.costPerItem ? Number(body.costPerItem) : null;
    const quantity = body.quantity ? Number(body.quantity) : null;
    const value = isNumber(costPerItem) && isNumber(quantity) ? costPerItem * quantity : null;

    return {
      ...baseCostDto,
      costCategory,
      description: body.description,
      costPerItem,
      quantity,
      value,
    };
  }

  protected async run(context: IContext, params: PcrAddSpendProfileCostParams, button: IFormButton, dto: PCRDto): Promise<ILinkInfo> {
    await context.runCommand(new UpdatePCRCommand(params.projectId, params.pcrId, dto));

    return PCRSpendProfileCostsSummaryRoute.getLink({
      projectId: params.projectId,
      pcrId: params.pcrId,
      itemId: params.itemId,
      costCategoryId: params.costCategoryId
    });
  }

  protected getStoreKey(params: PcrAddSpendProfileCostParams) {
    return storeKeys.getPcrKey(params.projectId, params.pcrId);
  }

  protected createValidationResult(params: PcrAddSpendProfileCostParams, dto: PCRDto) {
    return new PCRDtoValidator(dto, ProjectRole.Unknown, [], false, {} as ProjectDto, Configuration.features, dto);
  }
}
