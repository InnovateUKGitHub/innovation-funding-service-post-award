import {
  IContext,
  ILinkInfo,
  PCRDto,
  PCRItemForPartnerAdditionDto, PCRItemType,
  PCRSpendProfileCapitalUsageType,
  PCRSpendProfileOverheadRate,
  ProjectDto,
  ProjectRole
} from "@framework/types";
import { BadRequestError, configuration } from "@server/features/common";
import { GetPCRByIdQuery } from "@server/features/pcrs/getPCRByIdQuery";
import { UpdatePCRCommand } from "@server/features/pcrs/updatePcrCommand";
import { IFormBody, IFormButton, StandardFormHandlerBase } from "@server/forms/formHandlerBase";
import {
  PcrAddSpendProfileCostParams,
  PCRPrepareItemRoute,
  PCRSpendProfileAddCostRoute,
  PCRSpendProfileCostsSummaryRoute,
  PCRSpendProfileOverheadDocumentRoute
} from "@ui/containers";
import { PCRDtoValidator } from "@ui/validators";
import { CostCategoryType, PCRItemStatus } from "@framework/constants";
import { storeKeys } from "@ui/redux/stores/storeKeys";
import { GetUnfilteredCostCategoriesQuery } from "@server/features/claims";
import {
  PCRSpendProfileCapitalUsageCostDto,
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
import { AddPartnerStepNames } from "@ui/containers/pcrs/addPartner/addPartnerWorkflow";

interface IBaseCost {
  id: string;
  costCategoryId: string;
  description: string;
  value: number | null;
}

export class ProjectChangeRequestSpendProfileAddCostHandler extends StandardFormHandlerBase<PcrAddSpendProfileCostParams, "pcr"> {
  constructor() {
    super(PCRSpendProfileAddCostRoute, ["default", "calculateOverheadsDocuments"], "pcr");
  }

  protected async getDto(context: IContext, params: PcrAddSpendProfileCostParams, button: IFormButton, body: IFormBody): Promise<PCRDto> {
    const dto = await context.runQuery(new GetPCRByIdQuery(params.projectId, params.pcrId));

    const item = dto.items.find(x => x.id === params.itemId) as PCRItemForPartnerAdditionDto;

    if (!item) {
      throw new BadRequestError();
    }

    item.status = body.itemStatus === "true" ? PCRItemStatus.Complete : PCRItemStatus.Incomplete;

    const costCategories = await context.runQuery(new GetUnfilteredCostCategoriesQuery());
    const costCategory = costCategories.find(x => x.id === params.costCategoryId);

    if (!costCategory) {
      throw new BadRequestError("Unknown cost category");
    }

    const cost = this.getCost(costCategory, params, body, button);
    if (cost) item.spendProfile.costs.push(cost);

    return dto;
  }

  private getCost(costCategory: CostCategoryDto, params: PcrAddSpendProfileCostParams, body: IFormBody, button: IFormButton) {
    const baseCostDto = {
      id: "",
      costCategoryId: params.costCategoryId,
      description: body.description,
      value: parseNumber(body.value),
    };
    switch (costCategory.type) {
      case CostCategoryType.Labour: return this.getLabourCost(baseCostDto, costCategory.type, body);
      case CostCategoryType.Overheads: return this.getOverheadsCost(baseCostDto, costCategory.type, body, button);
      case CostCategoryType.Materials: return this.getMaterialsCost(baseCostDto, costCategory.type, body);
      case CostCategoryType.Subcontracting: return this.getSubcontractingCost(baseCostDto, costCategory.type, body);
      case CostCategoryType.Capital_Usage: return this.getCapitalUsageCost(baseCostDto, costCategory.type, body);
      case CostCategoryType.Travel_And_Subsistence: return this.getTravelAndSubsCost(baseCostDto, costCategory.type, body);
      case CostCategoryType.Other_Costs: return this.getOtherCost(baseCostDto, costCategory.type);
    }
  }

  private getLabourCost(baseCostDto: IBaseCost, costCategory: CostCategoryType.Labour, body: IFormBody): PCRSpendProfileLabourCostDto {
    return {
      ...baseCostDto,
      costCategory,
      grossCostOfRole: parseNumber(body.grossCostOfRole),
      daysSpentOnProject: parseNumber(body.daysSpentOnProject),
      ratePerDay: parseNumber(body.ratePerDay),
    };
  }

  private getOverheadsCost(baseCostDto: IBaseCost, costCategory: CostCategoryType.Overheads, body: IFormBody, button: IFormButton): PCRSpendProfileOverheadsCostDto {
    return {
      ...baseCostDto,
      costCategory,
      overheadRate: parseNumber(body.overheadRate) || PCRSpendProfileOverheadRate.Unknown,
      value: button.name === "calculateOverheadsDocuments" ? baseCostDto.value || 0 : baseCostDto.value
    };
  }

  private getMaterialsCost(baseCostDto: IBaseCost, costCategory: CostCategoryType.Materials, body: IFormBody): PCRSpendProfileMaterialsCostDto {
    return {
      ...baseCostDto,
      costCategory,
      costPerItem: parseNumber(body.costPerItem),
      quantity: parseNumber(body.quantity),
    };
  }

  private getSubcontractingCost(baseCostDto: IBaseCost, costCategory: CostCategoryType.Subcontracting, body: IFormBody): PCRSpendProfileSubcontractingCostDto {
    return {
      ...baseCostDto,
      costCategory,
      value: parseNumber(body.value),
      subcontractorCountry: body.subcontractorCountry,
      subcontractorRoleAndDescription: body.subcontractorRoleAndDescription,
    };
  }

  private getCapitalUsageCost(baseCostDto: IBaseCost, costCategory: CostCategoryType.Capital_Usage, body: IFormBody): PCRSpendProfileCapitalUsageCostDto {
    return {
      ...baseCostDto,
      costCategory,
      type: parseNumber(body.type) || PCRSpendProfileCapitalUsageType.Unknown,
      typeLabel: null,
      residualValue: parseNumber(body.residualValue),
      netPresentValue: parseNumber(body.netPresentValue),
      depreciationPeriod: parseNumber(body.depreciationPeriod),
      utilisation: parseNumber(body.utilisation),
    };
  }

  private getTravelAndSubsCost(baseCostDto: IBaseCost, costCategory: CostCategoryType.Travel_And_Subsistence, body: IFormBody): PCRSpendProfileTravelAndSubsCostDto {
    return {
      ...baseCostDto,
      costCategory,
      numberOfTimes: parseNumber(body.numberOfTimes),
      costOfEach: parseNumber(body.costOfEach),
    };
  }

  private getOtherCost(baseCostDto: IBaseCost, costCategory: CostCategoryType.Other_Costs): PCRSpendProfileOtherCostsDto {
    return {
      ...baseCostDto,
      costCategory,
    };
  }

  private getSpendProfileStep(context: IContext, pcrItem: PCRItemForPartnerAdditionDto) {
    const workflow = PcrWorkflow.getWorkflow(pcrItem, undefined);
    if (!workflow) return null;
    const stepName: AddPartnerStepNames = "spendProfileStep";
    return workflow.findStepNumberByName(stepName);
  }

  protected async run(context: IContext, params: PcrAddSpendProfileCostParams, button: IFormButton, dto: PCRDto): Promise<ILinkInfo> {
    await context.runCommand(new UpdatePCRCommand(params.projectId, params.pcrId, dto));

    const costCategories = await context.runQuery(new GetUnfilteredCostCategoriesQuery());
    const costCategoryDto = costCategories.find(x => x.id === params.costCategoryId)!;

    if (costCategoryDto.type === CostCategoryType.Overheads) {
      const pcrItem = dto.items.find(x => x.type === PCRItemType.PartnerAddition) as PCRItemForPartnerAdditionDto;

      if (button.name === "calculateOverheadsDocuments") {
        return PCRSpendProfileOverheadDocumentRoute.getLink({
          itemId: pcrItem.id,
          pcrId: dto.id,
          projectId: dto.projectId,
          costCategoryId: params.costCategoryId,
        });
      }
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

  protected getStoreKey(params: PcrAddSpendProfileCostParams) {
    return storeKeys.getPcrKey(params.projectId, params.pcrId);
  }

  protected createValidationResult(params: PcrAddSpendProfileCostParams, dto: PCRDto) {
    return new PCRDtoValidator(dto, ProjectRole.Unknown, [], false, {} as ProjectDto, configuration.features, dto);
  }
}
