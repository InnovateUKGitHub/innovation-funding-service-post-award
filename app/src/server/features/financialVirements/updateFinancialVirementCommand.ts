// tslint:disable:complexity
import { BadRequestError, CommandBase, QueryBase } from "@server/features/common";
import { Authorisation, IContext, ProjectRole } from "@framework/types";
import { GetAllForProjectQuery } from "../partners/getAllForProjectQuery";
import { flatten } from "@framework/util/arrayHelpers";
import { ISalesforceFinancialVirement } from "@server/repositories";
import { Updatable } from "@server/repositories/salesforceRepositoryBase";

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
