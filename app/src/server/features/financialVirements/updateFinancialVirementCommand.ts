// tslint:disable:complexity
import { CommandBase, ValidationError } from "@server/features/common";
import { Authorisation, IContext, ProjectRole } from "@framework/types";
import { flatten } from "@framework/util/arrayHelpers";
import { ISalesforceFinancialVirement } from "@server/repositories";
import { Updatable } from "@server/repositories/salesforceRepositoryBase";
import { CostCategoryFinancialVirement, PartnerFinancialVirement } from "@framework/entities";
import { FinancialVirementDtoValidator } from "@ui/validators/financialVirementDtoValidator";

export class UpdateFinancialVirementCommand extends CommandBase<boolean> {
  constructor(private readonly projectId: string, private readonly pcrId: string, private readonly pcrItemId: string, private readonly data: FinancialVirementDto, private readonly submit: boolean) {
    super();
  }

  protected async accessControl(auth: Authorisation, context: IContext) {
    return auth.forProject(this.projectId).hasAnyRoles(ProjectRole.ProjectManager);
  }

  protected async Run(context: IContext): Promise<boolean> {

    const existingVirements = await context.repositories.financialVirements.getAllForPcr(this.pcrItemId);

    const validator = new FinancialVirementDtoValidator(this.data, true, this.submit);
    if (!validator.isValid) {
      throw new ValidationError(validator);
    }

    const updates: Updatable<ISalesforceFinancialVirement>[] = [];
    const flattenedCostCategoryDtos = flatten(this.data.partners.map(partner => partner.virements.map(virement => ({ partnerId: partner.partnerId, costCategoryId: virement.costCategoryId, virement }))));

    existingVirements.forEach(partner => {
      const partnerDto = this.data.partners.find(x => x.partnerId === partner.partnerId);

      if (partnerDto) {
        const update = this.getPartnerUpdate(partner, partnerDto);
        if (update) {
          updates.push(update);
        }
      }

      partner.virements.forEach(virement => {
        const costCategoryDto = flattenedCostCategoryDtos.find(x => x.partnerId === partner.partnerId && x.costCategoryId === virement.costCategoryId);
        if (costCategoryDto) {
          const update = this.getCostCategoryUpdate(virement, costCategoryDto.virement);
          if (update) {
            updates.push(update);
          }
        }
      });
    });

    if (updates.length) {
      await context.repositories.financialVirements.updateVirements(updates);
    }

    return true;
  }

  private getCostCategoryUpdate(original: CostCategoryFinancialVirement, dto: CostCategoryVirementDto): Updatable<ISalesforceFinancialVirement> | null {
    let isUpdated = false;

    const update: Updatable<ISalesforceFinancialVirement> = {
      Id: original.id,
      Acc_Profile__c: original.profileId
    };

    if (original.newEligibleCosts !== dto.newEligibleCosts) {
      isUpdated = true;
      update.Acc_NewCosts__c = dto.newEligibleCosts;
    }

    return isUpdated ? update : null;
  }

  private getPartnerUpdate(original: PartnerFinancialVirement, dto: PartnerVirementsDto): Updatable<ISalesforceFinancialVirement> | null {
    let isUpdated = false;

    const update: Updatable<ISalesforceFinancialVirement> = {
      Id: original.id,
    };

    if (original.newFundingLevel !== dto.newFundingLevel) {
      isUpdated = true;
      update.Acc_NewAwardRate__c = dto.newFundingLevel;
    }

    return isUpdated ? update : null;
  }
}
