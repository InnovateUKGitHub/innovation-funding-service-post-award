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

    // todo: this will end up in the create pcr item code...
    // not production ready as calling query in a loop!

    const partners = await context.runQuery(new GetAllForProjectQuery(this.projectId));

    const partnerAndGolCostsPromises = partners.map(partner =>
      context.runQuery(new GetAllForecastsGOLCostsQuery(partner.id))
        .then(golCosts => ({ partner, golCosts, total: golCosts.reduce((total, g) => total + g.value, 0)}))
    );

    const partnerAndGolCosts = await Promise.all(partnerAndGolCostsPromises);

    const originalTotal = partnerAndGolCosts.reduce((total, golCosts) => total + golCosts.total, 0);

    return {
      pcrItemId: this.pcrItemId,
      currentTotal: originalTotal,
      originalTotal,
      partners: partnerAndGolCosts.map<PartnerVirementsDto>(x => ({
        partnerId: x.partner.id,
        partnerName: x.partner.name,
        isLead: x.partner.isLead,
        currentTotal: x.total,
        originalTotal: x.total,
        partnerVirements: x.golCosts.map<VirementDto>(y => ({ costCategoryId: y.costCategoryId, currentAmount: y.value, originalAmount: y.value }))
      }))
    };
  }
}
