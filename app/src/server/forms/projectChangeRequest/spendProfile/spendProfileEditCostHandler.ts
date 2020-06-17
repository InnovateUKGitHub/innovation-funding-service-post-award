import {
  IContext,
  ILinkInfo, Option,
  PCRDto,
  PCRItemForPartnerAdditionDto, PCRItemType,
  PCRSpendProfileOverheadRate,
  ProjectDto,
  ProjectRole
} from "@framework/types";
import { BadRequestError, Configuration } from "@server/features/common";
import { GetPCRByIdQuery } from "@server/features/pcrs/getPCRByIdQuery";
import { UpdatePCRCommand } from "@server/features/pcrs/updatePcrCommand";
import { IFormBody, IFormButton, StandardFormHandlerBase } from "@server/forms/formHandlerBase";
import {
  PcrEditSpendProfileCostParams, PCRPrepareItemRoute,
  PCRSpendProfileCostsSummaryRoute,
  PCRSpendProfileEditCostRoute
} from "@ui/containers";
import { PCRDtoValidator } from "@ui/validators";
import { PCRItemStatus, PCRSpendProfileCapitalUsageType } from "@framework/constants";
import { storeKeys } from "@ui/redux/stores/storeKeys";
import { GetCostCategoriesQuery } from "@server/features/claims";
import { CostCategoryType } from "@framework/entities";
import {
  PCRSpendProfileCapitalUsageCostDto,
  PCRSpendProfileCostDto,
  PCRSpendProfileLabourCostDto,
  PCRSpendProfileMaterialsCostDto,
  PCRSpendProfileOtherCostsDto,
  PCRSpendProfileOverheadsCostDto,
  PCRSpendProfileSubcontractingCostDto,
  PCRSpendProfileTravelAndSubsCostDto
} from "@framework/dtos/pcrSpendProfileDto";
import { parseNumber } from "@framework/util";
import { CostCategoryDto } from "@framework/dtos/costCategoryDto";
import { PcrWorkflow } from "@ui/containers/pcrs/pcrWorkflow";
import { addPartnerStepNames } from "@ui/containers/pcrs/addPartner/addPartnerWorkflow";
import { GetPcrSpendProfileOverheadRateOptionsQuery } from "@server/features/pcrs/getPcrSpendProfileOverheadRateOptionsQuery";

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

    this.updateCost(cost, costCategory, body);

    return dto;
  }

  private updateCost(cost: PCRSpendProfileCostDto,  costCategoryDto: CostCategoryDto, body: IFormBody) {
    switch (costCategoryDto.type) {
      case CostCategoryType.Labour: return this.updateLabourCost(cost as PCRSpendProfileLabourCostDto, body);
      case CostCategoryType.Overheads: return this.updateOverheadsCost(cost as PCRSpendProfileOverheadsCostDto, body);
      case CostCategoryType.Materials: return this.updateMaterialsCost(cost as PCRSpendProfileMaterialsCostDto, body);
      case CostCategoryType.Subcontracting: return this.updateSubcontractingCost(cost as PCRSpendProfileSubcontractingCostDto, body);
      case CostCategoryType.Capital_Usage: return this.updateCapitalUsagecost(cost as PCRSpendProfileCapitalUsageCostDto, body);
      case CostCategoryType.Travel_And_Subsistence: return this.updateTravelAndSubsCost(cost as PCRSpendProfileTravelAndSubsCostDto, body);
      case CostCategoryType.Other_Costs: return this.updateOtherCost(cost as PCRSpendProfileOtherCostsDto, body);
    }
  }

  private updateLabourCost(cost: PCRSpendProfileLabourCostDto,  body: IFormBody) {
    cost.daysSpentOnProject = parseNumber(body.daysSpentOnProject);
    cost.ratePerDay = parseNumber(body.ratePerDay);
    cost.description = body.description;
    cost.grossCostOfRole = parseNumber(body.grossCostOfRole);
  }

  private updateOverheadsCost(cost: PCRSpendProfileOverheadsCostDto,  body: IFormBody) {
    const overheadRate = parseNumber(body.overheadRate) || PCRSpendProfileOverheadRate.Unknown;
    cost.value = parseNumber(body.value);
    cost.overheadRate = overheadRate;
  }

  private updateMaterialsCost(cost: PCRSpendProfileMaterialsCostDto,  body: IFormBody) {
    cost.costPerItem = parseNumber(body.costPerItem);
    cost.quantity = parseNumber(body.quantity);
    cost.description = body.description;
  }

  private updateSubcontractingCost(cost: PCRSpendProfileSubcontractingCostDto,  body: IFormBody) {
    cost.subcontractorCountry = body.subcontractorCountry;
    cost.subcontractorRoleAndDescription = body.subcontractorRoleAndDescription;
    cost.description = body.description;
    cost.value = parseNumber(body.value);
  }

  private updateCapitalUsagecost(cost: PCRSpendProfileCapitalUsageCostDto, body: IFormBody) {
    cost.description = body.description;
    cost.type = parseNumber(body.type) || PCRSpendProfileCapitalUsageType.Unknown;
    cost.depreciationPeriod = parseNumber(body.depreciationPeriod);
    cost.netPresentValue = parseNumber(body.netPresentValue);
    cost.residualValue = parseNumber(body.residualValue);
    cost.utilisation = parseNumber(body.utilisation);
  }

  private updateTravelAndSubsCost(cost: PCRSpendProfileTravelAndSubsCostDto, body: IFormBody) {
    cost.description = body.description;
    cost.numberOfTimes = parseNumber(body.numberOfTimes);
    cost.costOfEach = parseNumber(body.costOfEach);
  }

  private updateOtherCost(cost: PCRSpendProfileOtherCostsDto,  body: IFormBody) {
    cost.description = body.description;
    cost.value = parseNumber(body.value);
  }

  private getSpendProfileStep(context: IContext, pcrItem: PCRItemForPartnerAdditionDto) {
    const workflow = PcrWorkflow.getWorkflow(pcrItem, undefined, context.config.features);
    if (!workflow) return null;
    const stepName: addPartnerStepNames = "spendProfileStep";
    return workflow.findStepNumberByName(stepName);
  }

  protected async run(context: IContext, params: PcrEditSpendProfileCostParams, button: IFormButton, dto: PCRDto): Promise<ILinkInfo> {
    await context.runCommand(new UpdatePCRCommand(params.projectId, params.pcrId, dto));

    const costCategories = await context.runQuery(new GetCostCategoriesQuery());
    const costCategoryDto = costCategories.find(x => x.id === params.costCategoryId)!;

    if (costCategoryDto.type === CostCategoryType.Overheads) {
      const pcrItem = dto.items.find(x => x.type === PCRItemType.PartnerAddition) as PCRItemForPartnerAdditionDto;
      return PCRPrepareItemRoute.getLink({
        itemId: pcrItem.id,
        pcrId: dto.id,
        projectId: dto.projectId,
        step: this.getSpendProfileStep(context, pcrItem) || undefined
      });
    }

    return PCRSpendProfileCostsSummaryRoute.getLink({
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
