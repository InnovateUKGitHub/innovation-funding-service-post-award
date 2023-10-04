import { CostCategoryGroupType, CostCategoryType } from "@framework/constants/enums";
import {
  PCRItemStatus,
  PCRItemType,
  PCRSpendProfileCapitalUsageType,
  PCRSpendProfileOverheadRate,
  PCRStepType,
} from "@framework/constants/pcrConstants";
import { CostCategoryDto } from "@framework/dtos/costCategoryDto";
import { PCRDto, PCRItemForPartnerAdditionDto } from "@framework/dtos/pcrDtos";
import {
  PCRSpendProfileCapitalUsageCostDto,
  PCRSpendProfileCostDto,
  PCRSpendProfileLabourCostDto,
  PCRSpendProfileMaterialsCostDto,
  PCRSpendProfileOtherCostsDto,
  PCRSpendProfileOverheadsCostDto,
  PCRSpendProfileSubcontractingCostDto,
  PCRSpendProfileTravelAndSubsCostDto,
} from "@framework/dtos/pcrSpendProfileDto";
import { CostCategoryList } from "@framework/types/CostCategory";
import { IContext } from "@framework/types/IContext";
import { ILinkInfo } from "@framework/types/ILinkInfo";
import { parseNumber } from "@framework/util/numberHelper";
import { GetUnfilteredCostCategoriesQuery } from "@server/features/claims/getCostCategoriesQuery";
import { GetPCRByIdQuery } from "@server/features/pcrs/getPCRByIdQuery";
import { UpdatePCRCommand } from "@server/features/pcrs/updatePcrCommand";
import { IFormBody, IFormButton, StandardFormHandlerBase } from "@server/htmlFormHandler/formHandlerBase";
import { BadRequestError } from "@shared/appError";
import { AddPartnerStepNames } from "@ui/containers/pages/pcrs/addPartner/addPartnerWorkflow";
import { PCRSpendProfileOverheadDocumentRoute } from "@ui/containers/pages/pcrs/addPartner/spendProfile/overheadDocumentContainer.page";
import { PCRSpendProfileCostsSummaryRoute } from "@ui/containers/pages/pcrs/addPartner/spendProfile/spendProfileCostsSummary.page";
import {
  PcrEditSpendProfileCostParams,
  PCRSpendProfileEditCostRoute,
} from "@ui/containers/pages/pcrs/addPartner/spendProfile/spendProfilePrepareCost.page";
import { PCRPrepareItemRoute } from "@ui/containers/pages/pcrs/pcrItemWorkflowContainer";
import { PcrWorkflow } from "@ui/containers/pages/pcrs/pcrWorkflow";
import { storeKeys } from "@ui/redux/stores/storeKeys";
import { PCRDtoValidator } from "@ui/validation/validators/pcrDtoValidator";

export class ProjectChangeRequestSpendProfileEditCostHandler extends StandardFormHandlerBase<
  PcrEditSpendProfileCostParams,
  "pcr"
> {
  constructor() {
    super(PCRSpendProfileEditCostRoute, ["default", "calculateOverheadsDocuments"], "pcr");
  }

  protected async getDto(
    context: IContext,
    params: PcrEditSpendProfileCostParams,
    button: IFormButton,
    body: IFormBody,
  ): Promise<PCRDto> {
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

    const cost = item.spendProfile.costs.find(
      x => x.id === params.costId && x.costCategoryId === params.costCategoryId,
    );
    if (!cost) {
      throw new BadRequestError("Cost not found");
    }

    this.updateCost(cost, costCategory, body, button);

    return dto;
  }

  private updateCost(
    cost: PCRSpendProfileCostDto,
    costCategoryDto: CostCategoryDto,
    body: IFormBody,
    button: IFormButton,
  ) {
    const costCategoryType = new CostCategoryList().fromId(costCategoryDto.type);
    switch (costCategoryType.group) {
      case CostCategoryGroupType.Labour:
        return this.updateLabourCost(cost as PCRSpendProfileLabourCostDto, body);
      case CostCategoryGroupType.Overheads:
        return this.updateOverheadsCost(cost as PCRSpendProfileOverheadsCostDto, body, button);
      case CostCategoryGroupType.Materials:
        return this.updateMaterialsCost(cost as PCRSpendProfileMaterialsCostDto, body);
      case CostCategoryGroupType.Subcontracting:
        return this.updateSubcontractingCost(cost as PCRSpendProfileSubcontractingCostDto, body);
      case CostCategoryGroupType.Capital_Usage:
        return this.updateCapitalUsageCost(cost as PCRSpendProfileCapitalUsageCostDto, body);
      case CostCategoryGroupType.Travel_And_Subsistence:
        return this.updateTravelAndSubsCost(cost as PCRSpendProfileTravelAndSubsCostDto, body);
      case CostCategoryGroupType.Other_Costs:
        return this.updateOtherCost(cost as PCRSpendProfileOtherCostsDto, body);
    }
  }

  private updateLabourCost(cost: PCRSpendProfileLabourCostDto, body: IFormBody) {
    cost.daysSpentOnProject = parseNumber(body.daysSpentOnProject);
    cost.ratePerDay = parseNumber(body.ratePerDay);
    cost.description = body.description;
    cost.grossCostOfRole = parseNumber(body.grossCostOfRole);
  }

  private updateOverheadsCost(cost: PCRSpendProfileOverheadsCostDto, body: IFormBody, button: IFormButton) {
    cost.value = parseNumber(body.value);
    cost.overheadRate = parseNumber(body.overheadRate) || PCRSpendProfileOverheadRate.Unknown;

    if (button.name === "calculateOverheadsDocuments" && !cost.value) {
      cost.value = 0;
    }
  }

  private updateMaterialsCost(cost: PCRSpendProfileMaterialsCostDto, body: IFormBody) {
    cost.costPerItem = parseNumber(body.costPerItem);
    cost.quantity = parseNumber(body.quantity);
    cost.description = body.description;
  }

  private updateSubcontractingCost(cost: PCRSpendProfileSubcontractingCostDto, body: IFormBody) {
    cost.subcontractorCountry = body.subcontractorCountry;
    cost.subcontractorRoleAndDescription = body.subcontractorRoleAndDescription;
    cost.description = body.description;
    cost.value = parseNumber(body.value);
  }

  private updateCapitalUsageCost(cost: PCRSpendProfileCapitalUsageCostDto, body: IFormBody) {
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

  private updateOtherCost(cost: PCRSpendProfileOtherCostsDto, body: IFormBody) {
    cost.description = body.description;
    cost.value = parseNumber(body.value);
  }

  private getSpendProfileStep(context: IContext, pcrItem: PCRItemForPartnerAdditionDto) {
    const workflow = PcrWorkflow.getWorkflow(pcrItem, undefined);
    if (!workflow) return null;
    const stepName: AddPartnerStepNames = PCRStepType.spendProfileStep;
    return workflow.findStepNumberByName(stepName);
  }

  protected async run(
    context: IContext,
    params: PcrEditSpendProfileCostParams,
    button: IFormButton,
    dto: PCRDto,
  ): Promise<ILinkInfo> {
    await context.runCommand(
      new UpdatePCRCommand({
        projectId: params.projectId,
        projectChangeRequestId: params.pcrId,
        pcr: dto,
        pcrStepType: PCRStepType.spendProfileStep,
      }),
    );

    const costCategories = await context.runQuery(new GetUnfilteredCostCategoriesQuery());
    const costCategoryDto = costCategories.find(x => x.id === params.costCategoryId);
    if (!costCategoryDto) throw new Error(`Cannot find cost category dto matching ${params.costCategoryId}`);
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
        step: this.getSpendProfileStep(context, pcrItem) || undefined,
      });
    }

    return PCRSpendProfileCostsSummaryRoute.getLink({
      projectId: params.projectId,
      pcrId: params.pcrId,
      itemId: params.itemId,
      costCategoryId: params.costCategoryId,
    });
  }

  protected getStoreKey(params: PcrEditSpendProfileCostParams) {
    return storeKeys.getPcrKey(params.projectId, params.pcrId);
  }

  protected createValidationResult(params: PcrEditSpendProfileCostParams, dto: PCRDto) {
    return new PCRDtoValidator({
      model: dto,
      original: dto,
    });
  }
}
