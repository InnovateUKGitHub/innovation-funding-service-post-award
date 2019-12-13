// tslint:disable:complexity
import { BadRequestError, CommandBase, QueryBase } from "@server/features/common";
import { Authorisation, IContext, ProjectRole } from "@framework/types";
import { GetAllForProjectQuery } from "../partners/getAllForProjectQuery";
import { flatten } from "@framework/util/arrayHelpers";
import { ISalesforceFinancialVirement } from "@server/repositories";
import { Updatable } from "@server/repositories/salesforceRepositoryBase";
import { identifier } from "@babel/types";

export class UpdateFinancialVirementCommand extends CommandBase<boolean> {
  constructor(private readonly projectId: string, private readonly pcrId: string, private readonly pcrItemId: string, private readonly data: FinancialVirementDto) {
    super();
  }

  protected async accessControl(auth: Authorisation, context: IContext) {
    return auth.forProject(this.projectId).hasAnyRoles(ProjectRole.ProjectManager);
  }

  protected async Run(context: IContext): Promise<boolean> {

    const existingVirements = await context.repositories.financialVirements.getAllForPcr(this.pcrItemId);

    // todo: this will end up in the create pcr item code...
    // not production ready as calling query in a loop!
    const partners = await context.runQuery(new GetAllForProjectQuery(this.projectId));

    const partnerAndProfilesPromises = partners.map(partner =>
      context.repositories.profileTotalCostCategory.getAllByPartnerId(partner.id)
        .then(profiles => ({ partner, profiles, total: profiles.reduce((total, g) => total + g.Acc_CostCategoryGOLCost__c, 0) }))
    );

    const partnerAndProfiles = await Promise.all(partnerAndProfilesPromises);

    const inserts: Partial<ISalesforceFinancialVirement>[] = [];
    const updates: Updatable<ISalesforceFinancialVirement>[] = [];

    this.data.partners.forEach(partner => {
      partner.virements.forEach(virement => {
        const existingVirement = existingVirements.find(x => x.Acc_Profile__r.Acc_ProjectParticipant__c === partner.partnerId && x.Acc_Profile__r.Acc_CostCategory__c === virement.costCategoryId);
        const existingProfile = flatten(partnerAndProfiles.filter(x => x.partner.id === partner.partnerId).map(x => x.profiles)).find(x => x.Acc_CostCategory__c === virement.costCategoryId);
        if (!existingProfile) {
          throw new BadRequestError("Partner profile not found");
        }
        if (!existingVirement) {
          inserts.push({
            Acc_CurrentAwardRate__c: partners.find(x => x.id === partner.partnerId)!.awardRate!,
            Acc_CurrentCosts__c: existingProfile.Acc_CostCategoryGOLCost__c,
            Acc_NewAwardRate__c: partners.find(x => x.id === partner.partnerId)!.awardRate!,
            Acc_NewCosts__c: virement.newAmount,
            Acc_Profile__c: existingProfile.Id,
            Acc_ProjectChangeRequest__c: this.pcrItemId
          });
        }
        else if (existingVirement.Acc_NewCosts__c !== virement.newAmount) {
          updates.push({
            Id: existingVirement.Id,
            Acc_NewCosts__c: virement.newAmount
          });
        }
      });
    });

    if (updates.length) {
      await context.repositories.financialVirements.updateVirements(updates);
    }

    if (inserts.length) {
      await context.repositories.financialVirements.insertVirements(inserts);
    }

    return true;
  }
}

export class UpdateFinancialVirementV2Command extends CommandBase<boolean> {
  constructor(private readonly projectId: string, private readonly pcrId: string, private readonly pcrItemId: string, private readonly data: FinancialVirementV2Dto) {
    super();
  }

  protected async accessControl(auth: Authorisation, context: IContext) {
    return auth.forProject(this.projectId).hasAnyRoles(ProjectRole.ProjectManager);
  }

  protected async Run(context: IContext): Promise<boolean> {

    const existingVirements = await context.repositories.financialVirements.getAllForPcr(this.pcrItemId);

    const partners = await context.repositories.partners.getAllByProjectId(this.projectId);

    // todo: this will end up in the create pcr item code...
    // not production ready as calling query in a loop!
    const existingProfiles = await Promise.all(partners.map(partner =>
      context.repositories.profileTotalCostCategory.getAllByPartnerId(partner.Id)
        .then(profiles => ({ partner, profiles, total: profiles.reduce((total, g) => total + g.Acc_CostCategoryGOLCost__c, 0) }))
    ));

    const paired = flatten([
      this.data.additions.map(x => ({ partnerId: x.partnerId, costCategoryId: x.costCategoryId, difference: x.difference })),
      this.data.subtractions.map(x => ({ partnerId: x.partnerId, costCategoryId: x.costCategoryId, difference: x.difference * -1 })),
    ])
      .map(dto => ({
        dto,
        existing: existingVirements.find(x => x.Acc_Profile__r.Acc_CostCategory__c === dto.costCategoryId && x.Acc_Profile__r.Acc_ProjectParticipant__c === dto.partnerId)
      }))
      ;

    const itemsToRemove = existingVirements.filter(x => !paired.some(y => x === y.existing)).map(x => x.Id);

    const itemsToUpdate = paired.filter(x => !!x.existing).map(x => ({ Id: x.existing!.Id, Acc_NewCosts__c: x.existing!.Acc_CurrentCosts__c + x.dto.difference }));

    const itemsToAdd = paired.filter(x => !x.existing).map(x => x.dto).map<Partial<ISalesforceFinancialVirement>>(dto => {
      const partner = partners.find(x => x.Id === dto.partnerId)!;
      const profiles = existingProfiles.find(x => x.partner.Id === dto.partnerId)!.profiles;
      const profile = profiles.find(x => x.Acc_CostCategory__c === dto.costCategoryId)!;

      return {
        Acc_CurrentAwardRate__c: partner.Acc_Award_Rate__c,
        Acc_CurrentCosts__c: profile.Acc_CostCategoryGOLCost__c,
        Acc_NewAwardRate__c: partner.Acc_Award_Rate__c,
        Acc_NewCosts__c: profile.Acc_CostCategoryGOLCost__c + dto.difference,
        Acc_Profile__c: profile.Id,
        Acc_ProjectChangeRequest__c: this.pcrItemId
      };
    });

    await context.repositories.financialVirements.deleteVirements(itemsToRemove);
    await context.repositories.financialVirements.updateVirements(itemsToUpdate);
    await context.repositories.financialVirements.insertVirements(itemsToAdd);
    return true;
  }
}
