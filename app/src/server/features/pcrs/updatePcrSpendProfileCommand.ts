/* tslint:disable:no-identical-functions */
import { BadRequestError, CommandBase, ValidationError } from "../common";
import { Option, ProjectRole } from "@framework/dtos";
import { Authorisation, IContext, PCRSpendProfileOverheadRate } from "@framework/types";
import { CostCategoryType, PcrSpendProfileEntity } from "@framework/entities";
import { isNumber, roundCurrency } from "@framework/util";
import {
  PCRSpendProfileAcademicCostDto,
  PCRSpendProfileCapitalUsageCostDto,
  PCRSpendProfileCostDto,
  PcrSpendProfileDto, PCRSpendProfileFundingDto,
  PCRSpendProfileLabourCostDto,
  PCRSpendProfileMaterialsCostDto,
  PCRSpendProfileOtherCostsDto,
  PCRSpendProfileOverheadsCostDto,
  PCRSpendProfileSubcontractingCostDto,
  PCRSpendProfileTravelAndSubsCostDto,
} from "@framework/dtos/pcrSpendProfileDto";
import { PCRSpendProfileDtoValidator } from "@ui/validators/pcrSpendProfileDtoValidator";
import { GetCostCategoriesQuery } from "@server/features/claims";
import { CostCategoryDto } from "@framework/dtos/costCategoryDto";
import { GetPcrSpendProfileOverheadRateOptionsQuery } from "@server/features/pcrs/getPcrSpendProfileOverheadRateOptionsQuery";

interface BaseCostFields {
  id: string;
  pcrItemId: string;
  costCategoryId: string;
  costCategory: CostCategoryType;
  description: string | null;
}

export class UpdatePCRSpendProfileCommand extends CommandBase<boolean> {
  constructor(private readonly projectId: string, private readonly pcrItemId: string, private readonly spendProfileDto: PcrSpendProfileDto) {
    super();
  }

  protected async accessControl(auth: Authorisation, context: IContext) {
    return auth.forProject(this.projectId).hasAnyRoles(ProjectRole.ProjectManager, ProjectRole.MonitoringOfficer);
  }

  private getBaseCostEntity(costsDto: PCRSpendProfileCostDto | PCRSpendProfileFundingDto): BaseCostFields {
    return {
      id: costsDto.id,
      pcrItemId: this.pcrItemId,
      costCategoryId: costsDto.costCategoryId,
      costCategory: costsDto.costCategory,
      description: costsDto.description || null,
    };
  }

  private mapPcrSpendProfileDtoToEntity(costsDto: PCRSpendProfileCostDto): PcrSpendProfileEntity {
    const init = this.getBaseCostEntity(costsDto);
    switch (costsDto.costCategory) {
      case CostCategoryType.Academic: return this.mapAcademic(costsDto, init);
      case CostCategoryType.Labour: return this.mapLabour(costsDto, init);
      case CostCategoryType.Materials: return this.mapMaterials(costsDto, init);
      case CostCategoryType.Subcontracting: return this.mapSubcontracting(costsDto, init);
      case CostCategoryType.Capital_Usage: return this.mapCapitalUsage(costsDto, init);
      case CostCategoryType.Travel_And_Subsistence: return this.mapTravelAndSubs(costsDto, init);
      case CostCategoryType.Other_Costs: return this.mapOtherCosts(costsDto, init);
      default: throw new BadRequestError("Cost category type not supported");
    }
  }

  private mapAcademic(costsDto: PCRSpendProfileAcademicCostDto, init: BaseCostFields) {
    return {
      ...init,
      value: isNumber(costsDto.value) ? costsDto.value : 0,
    };
  }

  private mapLabour(costsDto: PCRSpendProfileLabourCostDto, init: BaseCostFields) {
    return {
      ...init,
      value: isNumber(costsDto.ratePerDay) && isNumber(costsDto.daysSpentOnProject) ? costsDto.ratePerDay * costsDto.daysSpentOnProject : null,
      ratePerDay: isNumber(costsDto.ratePerDay) ? costsDto.ratePerDay : undefined,
      daysSpentOnProject: isNumber(costsDto.daysSpentOnProject) ? costsDto.daysSpentOnProject : undefined,
      grossCostOfRole: isNumber(costsDto.grossCostOfRole) ? costsDto.grossCostOfRole : undefined,
    };
  }

  private mapMaterials(costsDto: PCRSpendProfileMaterialsCostDto, init: BaseCostFields) {
    return {
      ...init,
      value: isNumber(costsDto.costPerItem) && isNumber(costsDto.quantity) ? costsDto.costPerItem * costsDto.quantity : null,
      costPerItem: isNumber(costsDto.costPerItem) ? costsDto.costPerItem : undefined,
      quantity: isNumber(costsDto.quantity) ? costsDto.quantity : undefined,
    };
  }

  private mapSubcontracting(costsDto: PCRSpendProfileSubcontractingCostDto, init: BaseCostFields) {
    return {
      ...init,
      value: isNumber(costsDto.value) ? costsDto.value : null,
      subcontractorCountry: costsDto.subcontractorCountry || undefined,
      subcontractorRoleAndDescription: costsDto.subcontractorRoleAndDescription || undefined,
    };
  }

  private mapCapitalUsage(costsDto: PCRSpendProfileCapitalUsageCostDto, init: BaseCostFields) {
    return {
      ...init,
      value: isNumber(costsDto.utilisation) && isNumber(costsDto.netPresentValue) && isNumber(costsDto.residualValue) ? (costsDto.utilisation / 100) * (costsDto.netPresentValue - costsDto.residualValue) : null,
      capitalUsageType: costsDto.type,
      depreciationPeriod: isNumber(costsDto.depreciationPeriod) ? costsDto.depreciationPeriod : undefined,
      netPresentValue: isNumber(costsDto.netPresentValue) ? costsDto.netPresentValue : undefined,
      residualValue: isNumber(costsDto.residualValue) ? costsDto.residualValue : undefined,
      utilisation: isNumber(costsDto.utilisation) ? costsDto.utilisation : undefined,
    };
  }

  private mapTravelAndSubs(costsDto: PCRSpendProfileTravelAndSubsCostDto, init: BaseCostFields) {
    return {
      ...init,
      value: isNumber(costsDto.numberOfTimes) && isNumber(costsDto.costOfEach) ? costsDto.numberOfTimes * costsDto.costOfEach : null,
      numberOfTimes: isNumber(costsDto.numberOfTimes) ? costsDto.numberOfTimes : undefined,
      costOfEach: isNumber(costsDto.costOfEach) ? costsDto.costOfEach : undefined,
    };
  }

  private mapOtherCosts(costsDto: PCRSpendProfileOtherCostsDto, init: BaseCostFields) {
    return {
      ...init,
      value: isNumber(costsDto.value) ? costsDto.value : null,
    };
  }

  private addOverheads(costCategories: CostCategoryDto[], costs: PcrSpendProfileEntity[], overheadsRates: Option<PCRSpendProfileOverheadRate>[]) {
    // Validation has already ensured there is at most one overheads cost
    const overheadsCostDto = this.spendProfileDto.costs.find(x => x.costCategory === CostCategoryType.Overheads) as PCRSpendProfileOverheadsCostDto;

    if (!overheadsCostDto) return;

    const overheadRateOption = overheadsRates.find(x => x.value === overheadsCostDto.overheadRate);

    if (overheadsCostDto.overheadRate && !overheadRateOption) throw new BadRequestError("Overhead rate not allowed");

    costs.push({
      ...this.getBaseCostEntity(overheadsCostDto),
      overheadRate: overheadsCostDto.overheadRate,
      description: overheadsCostDto.overheadRate ? overheadRateOption!.label : null,
      value: this.getOverheadsCostValue(overheadsCostDto, costCategories, costs)
    });
  }

  private getOverheadsCostValue(overheadsCostDto: PCRSpendProfileOverheadsCostDto, costCategories: CostCategoryDto[], costDtos: PcrSpendProfileEntity[]) {
    switch (overheadsCostDto.overheadRate) {
      case PCRSpendProfileOverheadRate.Unknown:
        return null;
      case PCRSpendProfileOverheadRate.Calculated:
        return overheadsCostDto.value;
      case PCRSpendProfileOverheadRate.Zero:
        return 0;
      case PCRSpendProfileOverheadRate.Twenty:
        const labourCostCategory = costCategories.find(x => x.type === CostCategoryType.Labour)!;
        const labourCosts = costDtos
          .filter(x => x.costCategoryId === labourCostCategory.id)
          .reduce((acc, item) => acc + (item.value || 0), 0);
        return roundCurrency(labourCosts * 20 / 100);
      default:
        return null;
    }
  }

  // tslint:disable-next-line:cognitive-complexity
  private getUpdatedCosts(originalCost: PcrSpendProfileEntity, cost: PcrSpendProfileEntity, costCategories: CostCategoryDto[]) {
    // Value and description are shared by all cost categories so if either has changed we can be sure that the cost needs updating.
    if (originalCost.value !== cost.value || originalCost.description !== cost.description) return cost;

    const costCategoryDto = costCategories.find(x => x.id === cost.costCategoryId);
    if (!costCategoryDto) {
      return null;
    }

    switch (costCategoryDto.type) {
      case CostCategoryType.Academic:
        if (originalCost.value !== cost.value) {
          return cost;
        }
      case CostCategoryType.Capital_Usage:
        if (originalCost.depreciationPeriod !== cost.depreciationPeriod || originalCost.netPresentValue !== cost.netPresentValue || originalCost.residualValue !== cost.residualValue || originalCost.capitalUsageType !== cost.capitalUsageType || originalCost.description !== cost.description) {
          return cost;
        }
      case CostCategoryType.Labour:
        if (originalCost.grossCostOfRole !== cost.grossCostOfRole || originalCost.ratePerDay !== cost.ratePerDay || originalCost.daysSpentOnProject !== cost.daysSpentOnProject) {
          return cost;
        }
      case CostCategoryType.Materials:
        if (originalCost.quantity !== cost.quantity || originalCost.costPerItem !== cost.costPerItem) {
          return cost;
        }
      case CostCategoryType.Overheads:
        if (originalCost.overheadRate !== cost.overheadRate) {
          return cost;
        }
      case CostCategoryType.Subcontracting:
        if (originalCost.subcontractorCountry !== cost.subcontractorCountry || originalCost.subcontractorRoleAndDescription !== cost.subcontractorRoleAndDescription) {
          return cost;
        }
      case CostCategoryType.Travel_And_Subsistence:
        if (originalCost.costOfEach !== cost.costOfEach || originalCost.numberOfTimes !== cost.numberOfTimes) {
          return cost;
        }
      default: return null;
    }
  }

  protected async Run(context: IContext): Promise<boolean> {
    if (this.pcrItemId !== this.spendProfileDto.pcrItemId) {
      throw new BadRequestError();
    }

    const validationResult = new PCRSpendProfileDtoValidator(this.spendProfileDto, true);

    if (!validationResult.isValid) {
      throw new ValidationError(validationResult);
    }

    const originalSpendProfiles = await context.repositories.pcrSpendProfile.getAllForPcr(this.pcrItemId);
    const costCategories = await context.runQuery(new GetCostCategoriesQuery());
    const overheadsRates = await context.runQuery(new GetPcrSpendProfileOverheadRateOptionsQuery());

    const mappedEntities = this.spendProfileDto.costs.filter(x => x.costCategory !== CostCategoryType.Overheads)
      .map(x => this.mapPcrSpendProfileDtoToEntity(x));

    this.addOverheads(costCategories, mappedEntities, overheadsRates);

    const paired = this.spendProfileDto.costs
      .map(cost => ({
        // This cannot be undefined as both map over the spend profile costs.
        cost: mappedEntities.find(x => x.id === cost.id)!,
        originalCost: originalSpendProfiles.find(x => x.id === cost.id)
      }));

    const costsToUpdate = paired
      .filter(x => !!x.originalCost)
      .map(x => {
        return this.getUpdatedCosts(x.originalCost!, x.cost, costCategories) as PcrSpendProfileEntity;
      })
      .filter(x => !!x);

    const newCostItems = mappedEntities.filter(x => !x.id);

    // Cross-match repository values with dto values
    const deletedCostItems = originalSpendProfiles
      .filter(x => mappedEntities.every(p => p.id !== x.id))
      .map(x => x.id);

    // Chose not to make following requests in parallel as SF has struggled in the past (esp if roll-ups become involved)
    await context.repositories.pcrSpendProfile.insertSpendProfiles(newCostItems);
    await context.repositories.pcrSpendProfile.updateSpendProfiles(costsToUpdate);
    await context.repositories.pcrSpendProfile.deleteSpendProfiles(deletedCostItems);

    return true;
  }
}
