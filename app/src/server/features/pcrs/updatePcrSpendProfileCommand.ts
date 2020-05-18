import { BadRequestError, CommandBase, ValidationError } from "../common";
import { ProjectRole } from "@framework/dtos";
import { Authorisation, IContext } from "@framework/types";
import { CostCategoryType, PcrSpendProfileEntity, PcrSpendProfileEntityForCreate, } from "@framework/entities";
import { isNumber } from "@framework/util";
import { GetPcrSpendProfilesQuery } from "@server/features/pcrs/getPcrSpendProfiles";
import {
  PCRSpendProfileCapitalUsageCostDto,
  PCRSpendProfileCostDto,
  PcrSpendProfileDto,
  PCRSpendProfileLabourCostDto, PCRSpendProfileMaterialsCostDto,
} from "@framework/dtos/pcrSpendProfileDto";
import { PCRSpendProfileDtoValidator } from "@ui/validators/pcrSpendProfileDtoValidator";

interface BaseCostFields {
  pcrItemId: string;
  costCategoryId: string;
  costCategory: CostCategoryType;
  description: string | undefined;
}

export class UpdatePCRSpendProfileCommand extends CommandBase<boolean> {
  constructor(private projectId: string, private pcrItemId: string, private spendProfileDto: PcrSpendProfileDto) {
    super();
  }

  protected async accessControl(auth: Authorisation, context: IContext) {
    return auth.forProject(this.projectId).hasAnyRoles(ProjectRole.ProjectManager, ProjectRole.MonitoringOfficer);
  }

  private mapPcrSpendProfileDtoToCreateEntity(costsDto: PCRSpendProfileCostDto): PcrSpendProfileEntityForCreate {
    const init = {
      pcrItemId: this.pcrItemId,
      costCategoryId: costsDto.costCategoryId,
      costCategory: costsDto.costCategory,
      description: costsDto.description || undefined,
    };
    switch (costsDto.costCategory) {
      case CostCategoryType.Labour: return this.mapLabour(costsDto, init);
      case CostCategoryType.Materials: return this.mapMaterials(costsDto, init);
      case CostCategoryType.Capital_Usage: return this.mapCapitalUsage(costsDto, init);
      default: return init;
    }
  }

  private mapLabour(costsDto: PCRSpendProfileLabourCostDto, init: BaseCostFields) {
    return {
      ...init,
      value: isNumber(costsDto.ratePerDay) && isNumber(costsDto.daysSpentOnProject) ? costsDto.ratePerDay * costsDto.daysSpentOnProject : undefined,
      ratePerDay: isNumber(costsDto.ratePerDay) ? costsDto.ratePerDay : undefined,
      daysSpentOnProject: isNumber(costsDto.daysSpentOnProject) ? costsDto.daysSpentOnProject : undefined,
      grossCostOfRole: isNumber(costsDto.grossCostOfRole) ? costsDto.grossCostOfRole : undefined,
    };
  }

  private mapMaterials(costsDto: PCRSpendProfileMaterialsCostDto, init: BaseCostFields) {
    return {
      ...init,
      value: isNumber(costsDto.costPerItem) && isNumber(costsDto.quantity) ? costsDto.costPerItem * costsDto.quantity : undefined,
      costPerItem: isNumber(costsDto.costPerItem) ? costsDto.costPerItem : undefined,
      quantity: isNumber(costsDto.quantity) ? costsDto.quantity : undefined,
    };
  }

  private mapCapitalUsage(costsDto: PCRSpendProfileCapitalUsageCostDto, init: BaseCostFields) {
    return {
      ...init,
      value: isNumber(costsDto.utilisation) && isNumber(costsDto.netPresentValue) && isNumber(costsDto.residualValue) ? (costsDto.utilisation / 100) * (costsDto.netPresentValue - costsDto.residualValue) : undefined,
      type: costsDto.type,
      depreciationPeriod: isNumber(costsDto.depreciationPeriod) ? costsDto.depreciationPeriod : undefined,
      netPresentValue: isNumber(costsDto.netPresentValue) ? costsDto.netPresentValue : undefined,
      residualValue: isNumber(costsDto.residualValue) ? costsDto.residualValue : undefined,
      utilisation: isNumber(costsDto.utilisation) ? costsDto.utilisation : undefined,
    };
  }

  private mapPcrSpendProfileDtoToEntity(costsDto: PCRSpendProfileCostDto): PcrSpendProfileEntity {
    return { ...this.mapPcrSpendProfileDtoToCreateEntity(costsDto), id: costsDto.id };
  }

  protected async Run(context: IContext): Promise<boolean> {
    if (this.pcrItemId !== this.spendProfileDto.pcrItemId) {
      throw new BadRequestError();
    }

    const validationResult = new PCRSpendProfileDtoValidator(this.spendProfileDto, true);

    if (!validationResult.isValid) {
      throw new ValidationError(validationResult);
    }

    const originalSpendProfileDto = await context.runQuery(new GetPcrSpendProfilesQuery(this.pcrItemId));

    const newCostItems = this.spendProfileDto.costs.filter(x => !x.id);
    const persistedCostItems = this.spendProfileDto.costs.filter(x => x.id);
    const deletedCostItems = originalSpendProfileDto.costs
    // Cross-match repository values with dto values
      .filter(x => persistedCostItems.every(p => p.id !== x.id))
      // Can assume ID is present because values are from repository
      .map(x => x.id);

    // Chose not to make following requests in parallel as SF has struggled in the past (esp if roll-ups become involved)
    if (newCostItems.length > 0) {
      await context.repositories.pcrSpendProfile.insertSpendProfiles(newCostItems.map(x => this.mapPcrSpendProfileDtoToCreateEntity(x)));
    }

    if (persistedCostItems.length > 0) {
      await context.repositories.pcrSpendProfile.updateSpendProfiles(persistedCostItems.map(x => this.mapPcrSpendProfileDtoToEntity(x)));
    }

    if (deletedCostItems.length > 0) {
      await context.repositories.pcrSpendProfile.deleteSpendProfiles(deletedCostItems);
    }

    return true;
  }
}
