import { QueryBase } from "@server/features/common";
import { Authorisation, IContext, ProjectRole } from "@framework/types";
import { GetAllForProjectQuery } from "../partners/getAllForProjectQuery";
import { GetAllForecastsGOLCostsQuery } from "../claims";

export class GetFinancialVirementsQuery extends QueryBase<FinancialVirementDto> {
  constructor(private projectId: string, private pcrId: string, private pcrItemId: string) {
    super();
  }

  protected async accessControl(auth: Authorisation, context: IContext) {
    return auth.forProject(this.projectId).hasAnyRoles(ProjectRole.MonitoringOfficer, ProjectRole.ProjectManager);
  }

  protected async Run(context: IContext): Promise<FinancialVirementDto> {

    const data = await context.repositories.financialVirements.getAllForPcr(this.pcrItemId);

    // todo: this will end up in the create pcr item code...
    // not production ready as calling query in a loop!

    const partners = await context.runQuery(new GetAllForProjectQuery(this.projectId));

    const partnerAndGolCostsPromises = partners.map(partner =>
      context.runQuery(new GetAllForecastsGOLCostsQuery(partner.id))
        .then(golCosts => ({ partner, golCosts, total: golCosts.reduce((total, g) => total + g.value, 0) }))
    );

    const partnerAndGolCosts = await Promise.all(partnerAndGolCostsPromises);

    const combined = partnerAndGolCosts.map(x => {
      const costCategories = x.golCosts.map(golCost => {

        const saved = data.find(savedItem =>
          savedItem.Acc_Profile__r.Acc_CostCategory__c === golCost.costCategoryId &&
          savedItem.Acc_Profile__r.Acc_ProjectParticipant__c === x.partner.id
        );

        return {
          costcategoryId: golCost.costCategoryId,
          costCategoryName: golCost.costCategoryName,
          originalAmount: saved ? saved.Acc_CurrentCosts__c : golCost.value,
          newAmount: saved ? saved.Acc_NewCosts__c : golCost.value,
        };
      });

      return {
        partner: x.partner,
        costCategories,
        originalTotal: costCategories.reduce((total, c) => total + c.originalAmount, 0),
        newTotal: costCategories.reduce((total, c) => total + c.newAmount, 0)
      };
    });

    const originalTotal = combined.reduce((total, c) => total + c.originalTotal, 0);
    const newTotal = combined.reduce((total, c) => total + c.newTotal, 0);

    return {
      pcrItemId: this.pcrItemId,
      originalTotal,
      newTotal,
      partners: combined.map<PartnerVirementsDto>(x => ({
        partnerId: x.partner.id,
        partnerName: x.partner.name,
        isLead: x.partner.isLead,
        originalTotal: x.originalTotal,
        newTotal: x.newTotal,
        virements: x.costCategories.map<VirementDto>(y => ({
          costCategoryId: y.costcategoryId,
          costCategoryName: y.costCategoryName,
          newAmount: y.newAmount,
          originalAmount: y.originalAmount
        }))
      }))
    };
  }
}
