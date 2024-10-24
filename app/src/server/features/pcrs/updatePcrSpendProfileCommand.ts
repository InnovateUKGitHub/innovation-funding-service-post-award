import { CostCategoryType, CostCategoryGroupType } from "@framework/constants/enums";
import { PCRSpendProfileOverheadRate } from "@framework/constants/pcrConstants";
import { ProjectRolePermissionBits } from "@framework/constants/project";
import { CostCategoryDto } from "@framework/dtos/costCategoryDto";
import { Option } from "@framework/dtos/option";
import {
  PcrSpendProfileDto,
  PCRSpendProfileCostDto,
  PCRSpendProfileFundingDto,
  PCRSpendProfileOtherFundingDto,
  PCRSpendProfileLabourCostDto,
  PCRSpendProfileMaterialsCostDto,
  PCRSpendProfileSubcontractingCostDto,
  PCRSpendProfileCapitalUsageCostDto,
  PCRSpendProfileTravelAndSubsCostDto,
  PCRSpendProfileAcademicCostDto,
  PCRSpendProfileOtherCostsDto,
  PCRSpendProfileOverheadsCostDto,
} from "@framework/dtos/pcrSpendProfileDto";
import { PcrSpendProfileEntity } from "@framework/entities/pcrSpendProfile";
import { Authorisation } from "@framework/types/authorisation";
import { CostCategoryList } from "@framework/types/CostCategory";
import { IContext } from "@framework/types/IContext";
import { isNumber, roundCurrency } from "@framework/util/numberHelper";
import { GetPcrSpendProfileOverheadRateOptionsQuery } from "@server/features/pcrs/getPcrSpendProfileOverheadRateOptionsQuery";
import { PCRSpendProfileDtoValidator } from "@ui/validation/validators/pcrSpendProfileDtoValidator";
import { GetUnfilteredCostCategoriesQuery } from "../claims/getCostCategoriesQuery";
import { BadRequestError, InActiveProjectError, ValidationError } from "../common/appError";
import { AuthorisedAsyncCommandBase } from "../common/commandBase";
import { GetProjectStatusQuery } from "../projects/GetProjectStatus";

interface BaseEntityFields {
  id: CostId;
  pcrItemId: PcrItemId;
  costCategoryId: CostCategoryId;
  costCategory: CostCategoryType;
  description: string | null;
}

export class UpdatePCRSpendProfileCommand extends AuthorisedAsyncCommandBase<boolean> {
  public readonly runnableName: string = "UpdatePCRSpendProfileCommand";
  constructor(
    private readonly projectId: ProjectId,
    private readonly pcrItemId: PcrItemId,
    private readonly spendProfileDto: PcrSpendProfileDto,
  ) {
    super();
  }

  async accessControl(auth: Authorisation) {
    return auth.forProject(this.projectId).hasAnyRoles(ProjectRolePermissionBits.ProjectManager);
  }

  private getBaseSpendProfileEntity(dto: PCRSpendProfileCostDto | PCRSpendProfileFundingDto): BaseEntityFields {
    return {
      id: dto.id,
      pcrItemId: this.pcrItemId,
      costCategoryId: dto.costCategoryId,
      costCategory: dto.costCategory,
      description: dto.description || null,
    };
  }

  private mapPcrSpendProfileDtoToEntity(
    context: IContext,
    dto: PCRSpendProfileCostDto | PCRSpendProfileFundingDto,
  ): PcrSpendProfileEntity {
    const init = this.getBaseSpendProfileEntity(dto);
    const costCategoryType = new CostCategoryList().fromId(dto.costCategory);
    switch (costCategoryType.group) {
      case CostCategoryGroupType.Other_Funding:
        return this.mapOtherFunding(context, dto as PCRSpendProfileOtherFundingDto, init);
      case CostCategoryGroupType.Academic:
        return this.mapAcademic(dto, init);
      case CostCategoryGroupType.Labour:
        return this.mapLabour(dto as PCRSpendProfileLabourCostDto, init);
      case CostCategoryGroupType.Materials:
        return this.mapMaterials(dto as PCRSpendProfileMaterialsCostDto, init);
      case CostCategoryGroupType.Subcontracting:
        return this.mapSubcontracting(dto as PCRSpendProfileSubcontractingCostDto, init);
      case CostCategoryGroupType.Capital_Usage:
        return this.mapCapitalUsage(dto as PCRSpendProfileCapitalUsageCostDto, init);
      case CostCategoryGroupType.Travel_And_Subsistence:
        return this.mapTravelAndSubs(dto as PCRSpendProfileTravelAndSubsCostDto, init);
      case CostCategoryGroupType.Other_Costs:
      default:
        return this.mapOtherCosts(dto, init);
    }
  }

  private mapOtherFunding(
    context: IContext,
    dto: PCRSpendProfileOtherFundingDto,
    init: BaseEntityFields,
  ): PcrSpendProfileEntity {
    return {
      ...init,
      value: isNumber(dto.value) ? dto.value : 0,
      dateOtherFundingSecured: context.clock.formatOptionalSalesforceDate(dto.dateSecured) || undefined,
    };
  }

  private mapAcademic(costsDto: PCRSpendProfileAcademicCostDto, init: BaseEntityFields) {
    return {
      ...init,
      value: isNumber(costsDto.value) ? costsDto.value : 0,
    };
  }

  private mapLabour(costsDto: PCRSpendProfileLabourCostDto, init: BaseEntityFields) {
    return {
      ...init,
      value:
        isNumber(costsDto.ratePerDay) && isNumber(costsDto.daysSpentOnProject)
          ? costsDto.ratePerDay * costsDto.daysSpentOnProject
          : null,
      ratePerDay: isNumber(costsDto.ratePerDay) ? costsDto.ratePerDay : undefined,
      daysSpentOnProject: isNumber(costsDto.daysSpentOnProject) ? costsDto.daysSpentOnProject : undefined,
      grossCostOfRole: isNumber(costsDto.grossCostOfRole) ? costsDto.grossCostOfRole : undefined,
    };
  }

  private mapMaterials(costsDto: PCRSpendProfileMaterialsCostDto, init: BaseEntityFields) {
    return {
      ...init,
      value:
        isNumber(costsDto.costPerItem) && isNumber(costsDto.quantity) ? costsDto.costPerItem * costsDto.quantity : null,
      costPerItem: isNumber(costsDto.costPerItem) ? costsDto.costPerItem : undefined,
      quantity: isNumber(costsDto.quantity) ? costsDto.quantity : undefined,
    };
  }

  private mapSubcontracting(costsDto: PCRSpendProfileSubcontractingCostDto, init: BaseEntityFields) {
    return {
      ...init,
      value: isNumber(costsDto.value) ? costsDto.value : null,
      subcontractorCountry: costsDto.subcontractorCountry || undefined,
      subcontractorRoleAndDescription: costsDto.subcontractorRoleAndDescription || undefined,
    };
  }

  private mapCapitalUsage(costsDto: PCRSpendProfileCapitalUsageCostDto, init: BaseEntityFields) {
    return {
      ...init,
      value:
        isNumber(costsDto.utilisation) && isNumber(costsDto.netPresentValue) && isNumber(costsDto.residualValue)
          ? (costsDto.utilisation / 100) * (costsDto.netPresentValue - costsDto.residualValue)
          : null,
      capitalUsageType: costsDto.type,
      depreciationPeriod: isNumber(costsDto.depreciationPeriod) ? costsDto.depreciationPeriod : undefined,
      netPresentValue: isNumber(costsDto.netPresentValue) ? costsDto.netPresentValue : undefined,
      residualValue: isNumber(costsDto.residualValue) ? costsDto.residualValue : undefined,
      utilisation: isNumber(costsDto.utilisation) ? costsDto.utilisation : undefined,
    };
  }

  private mapTravelAndSubs(costsDto: PCRSpendProfileTravelAndSubsCostDto, init: BaseEntityFields) {
    return {
      ...init,
      value:
        isNumber(costsDto.numberOfTimes) && isNumber(costsDto.costOfEach)
          ? costsDto.numberOfTimes * costsDto.costOfEach
          : null,
      numberOfTimes: isNumber(costsDto.numberOfTimes) ? costsDto.numberOfTimes : undefined,
      costOfEach: isNumber(costsDto.costOfEach) ? costsDto.costOfEach : undefined,
    };
  }

  private mapOtherCosts(costsDto: PCRSpendProfileOtherCostsDto, init: BaseEntityFields) {
    return {
      ...init,
      value: isNumber(costsDto.value) ? costsDto.value : null,
    };
  }

  private addOverheads(
    costCategories: CostCategoryDto[],
    entities: PcrSpendProfileEntity[],
    overheadsRates: Option<PCRSpendProfileOverheadRate>[],
  ) {
    // Validation has already ensured there is at most one overheads cost
    const overheadsCostDto = this.spendProfileDto.costs.find(
      x => new CostCategoryList().fromId(x.costCategory).group === CostCategoryGroupType.Overheads,
    ) as PCRSpendProfileOverheadsCostDto;
    if (!overheadsCostDto || !overheadsCostDto.overheadRate) return;

    const overheadRate = overheadsCostDto.overheadRate;
    const overheadRateOption = overheadsRates.find(x => x.value === overheadRate);

    if (!overheadRateOption) throw new BadRequestError("Overhead rate not allowed");

    entities.push({
      ...this.getBaseSpendProfileEntity(overheadsCostDto),
      overheadRate,
      description: overheadsCostDto.overheadRate ? overheadRateOption.label : null,
      value: this.getOverheadsCostValue(overheadsCostDto, costCategories, entities),
    });
  }

  private getOverheadsCostValue(
    overheadsCostDto: PCRSpendProfileOverheadsCostDto,
    costCategories: CostCategoryDto[],
    items: PcrSpendProfileEntity[],
  ) {
    const labourCostCategory = costCategories.find(
      x => new CostCategoryList().fromId(x.type).group === CostCategoryGroupType.Labour,
    );
    if (!labourCostCategory) throw new Error(`Cannot find any labour cost categories`);

    const labourCosts = items
      .filter(x =>
        x.costCategory
          ? new CostCategoryList().fromId(x.costCategory).group === CostCategoryGroupType.Labour
          : undefined,
      )
      .reduce((acc, item) => acc + (item.value || 0), 0);

    switch (overheadsCostDto.overheadRate) {
      case PCRSpendProfileOverheadRate.Unknown:
        return null;
      case PCRSpendProfileOverheadRate.Calculated:
        return overheadsCostDto.value;
      case PCRSpendProfileOverheadRate.Zero:
        return 0;
      case PCRSpendProfileOverheadRate.Twenty:
        return roundCurrency((labourCosts * 20) / 100);
      default:
        return null;
    }
  }

  private getUpdatedCosts(
    originalCost: PcrSpendProfileEntity,
    cost: PcrSpendProfileEntity,
    costCategories: CostCategoryDto[],
  ) {
    // Value and description are shared by all cost categories so if either has changed we can be sure that the cost needs updating.
    if (originalCost.value !== cost.value || originalCost.description !== cost.description) return cost;

    const costCategoryDto = costCategories.find(x => x.id === cost.costCategoryId);

    if (!costCategoryDto) {
      return null;
    }

    const costCategoryType = new CostCategoryList().fromId(costCategoryDto.type);

    switch (costCategoryType.group) {
      case CostCategoryGroupType.Academic:
        if (originalCost.value !== cost.value) {
          return cost;
        }
      case CostCategoryGroupType.Other_Funding:
        if (
          originalCost.value !== cost.value ||
          originalCost.description !== cost.description ||
          originalCost.dateOtherFundingSecured !== cost.dateOtherFundingSecured
        ) {
          return cost;
        }
      case CostCategoryGroupType.Capital_Usage:
        if (
          originalCost.depreciationPeriod !== cost.depreciationPeriod ||
          originalCost.netPresentValue !== cost.netPresentValue ||
          originalCost.residualValue !== cost.residualValue ||
          originalCost.capitalUsageType !== cost.capitalUsageType ||
          originalCost.description !== cost.description
        ) {
          return cost;
        }
      case CostCategoryGroupType.Labour:
        if (
          originalCost.grossCostOfRole !== cost.grossCostOfRole ||
          originalCost.ratePerDay !== cost.ratePerDay ||
          originalCost.daysSpentOnProject !== cost.daysSpentOnProject
        ) {
          return cost;
        }
      case CostCategoryGroupType.Materials:
        if (originalCost.quantity !== cost.quantity || originalCost.costPerItem !== cost.costPerItem) {
          return cost;
        }
      case CostCategoryGroupType.Overheads:
        if (originalCost.overheadRate !== cost.overheadRate) {
          return cost;
        }
      case CostCategoryGroupType.Subcontracting:
        if (
          originalCost.subcontractorCountry !== cost.subcontractorCountry ||
          originalCost.subcontractorRoleAndDescription !== cost.subcontractorRoleAndDescription
        ) {
          return cost;
        }
      case CostCategoryGroupType.Travel_And_Subsistence:
        if (originalCost.costOfEach !== cost.costOfEach || originalCost.numberOfTimes !== cost.numberOfTimes) {
          return cost;
        }
      default:
        return null;
    }
  }

  protected async run(context: IContext): Promise<boolean> {
    if (this.pcrItemId && this.pcrItemId !== this.spendProfileDto?.pcrItemId) {
      // if both are falsy, then will be a new PCR type being created, will therefore need to
      // allow through this check
      throw new BadRequestError();
    }

    const { isActive: isProjectActive } = await context.runQuery(new GetProjectStatusQuery(this.projectId));

    if (!isProjectActive) {
      throw new InActiveProjectError();
    }

    const validationResult = new PCRSpendProfileDtoValidator(this.spendProfileDto, true);

    if (!validationResult.isValid) {
      throw new ValidationError(validationResult);
    }

    const originalSpendProfiles = this.pcrItemId
      ? await context.repositories.pcrSpendProfile.getAllForPcr(this.projectId, this.pcrItemId)
      : [];

    const costCategories = await context.runQuery(new GetUnfilteredCostCategoriesQuery());
    const overheadsRates = await context.runQuery(new GetPcrSpendProfileOverheadRateOptionsQuery());

    const mappedEntities = [...this.spendProfileDto.costs, ...this.spendProfileDto.funds]
      .filter(x => new CostCategoryList().fromId(x.costCategory).group !== CostCategoryGroupType.Overheads)
      .map(x => this.mapPcrSpendProfileDtoToEntity(context, x));

    this.addOverheads(costCategories, mappedEntities, overheadsRates);

    const paired = [...this.spendProfileDto.costs, ...this.spendProfileDto.funds].map(cost => ({
      // This cannot be undefined as both map over the spend profile costs.
      cost: mappedEntities.find(x => x.id === cost.id),
      originalCost: originalSpendProfiles.find(x => x.id === cost.id),
    }));

    const costsToUpdate = paired
      .filter(x => !!x.originalCost)
      .map(x => {
        return this.getUpdatedCosts(
          x.originalCost as PcrSpendProfileEntity,
          x.cost as PcrSpendProfileEntity,
          costCategories,
        ) as PcrSpendProfileEntity;
      })
      .filter(x => !!x);

    const newCostItems = mappedEntities.filter(x => !x.id);

    // Cross-match repository values with dto values
    const deletedCostItems = originalSpendProfiles.filter(x => mappedEntities.every(p => p.id !== x.id)).map(x => x.id);

    // Chose not to make following requests in parallel as SF has struggled in the past (esp if roll-ups become involved)
    await context.repositories.pcrSpendProfile.insertSpendProfiles(newCostItems);
    await context.repositories.pcrSpendProfile.updateSpendProfiles(costsToUpdate);
    await context.repositories.pcrSpendProfile.deleteSpendProfiles(deletedCostItems);

    return true;
  }
}
