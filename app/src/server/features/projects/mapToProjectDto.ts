import { CommandBase, IContext } from "../common/context";
import { ISalesforceProject } from "../../repositories/projectsRepository";
import { ClaimFrequency, ProjectDto } from "../../../types";

export class MapToProjectDtoCommand extends CommandBase<ProjectDto> {
  constructor(readonly item: ISalesforceProject) {
    super();
   }

  async Run(context: IContext) {
    const claimFrequency = this.mapFrequencyToEnum(this.item.Acc_ClaimFrequency__c);
    const dto: ProjectDto = {
      id: this.item.Id,
      title: this.item.Acc_ProjectTitle__c,
      summary: this.item.Acc_ProjectSummary__c,
      startDate: context.clock.parse(this.item.Acc_StartDate__c, "yyyy-MM-dd")!,
      endDate: context.clock.parse(this.item.Acc_EndDate__c, "yyyy-MM-dd")!,
      projectNumber: this.item.Acc_ProjectNumber__c,
      applicationUrl: this.getIFSUrl(this.item, context.config.ifsApplicationUrl),
      grantOfferLetterUrl: this.getIFSUrl(this.item, context.config.ifsGrantLetterUrl),
      claimFrequency,
      claimFrequencyName: ClaimFrequency[claimFrequency],
      grantOfferLetterCosts: this.item.Acc_GOLTotalCostAwarded__c,
      costsClaimedToDate: this.item.Acc_TotalProjectCosts__c,
      claimedPercentage: this.item.Acc_GOLTotalCostAwarded__c ? 100 * this.item.Acc_TotalProjectCosts__c / this.item.Acc_GOLTotalCostAwarded__c : null,
      periodId: NaN,
    };

    dto.periodId = this.calcPeriod(context, dto);

    return Promise.resolve(dto);
  }

  mapFrequencyToEnum(freq: string): ClaimFrequency {
    switch(freq) {
      case "Quarterly": return ClaimFrequency.Quarterly;
      case "Monthly":   return ClaimFrequency.Monthly;
      default:          return ClaimFrequency.Unknown;
    }
  }

  calcPeriod(context: IContext, dto: ProjectDto): number {
    if(!dto.startDate || dto.claimFrequency === ClaimFrequency.Unknown) {
      return 0;
    }
    const today        = context.clock.today();
    const currentMonth = today.getUTCMonth();
    const startMonth   = dto.startDate.getUTCMonth();
    const frequency    = dto.claimFrequency;

    // add 1 to increment index from 0-11 to 1-12
    const periodMonth  = 1 + ((currentMonth - startMonth) + 12) % 12;

    return frequency === ClaimFrequency.Quarterly
      ? Math.ceil(periodMonth / 3)
      : periodMonth;
  }

  private getIFSUrl(project: ISalesforceProject, ifsUrl: string): string | null {
    if (ifsUrl && project.Acc_ProjectSource__c === "IFS") {
      /// foreach prop in project build regex replacing <<PROP_NAME>> with value and then replace the expected value in string
      return Object.keys(project)
        .map(key => ({ regEx: new RegExp(`<<${key}>>`, "g"), val: (project as any)[key] }))
        .reduce((url, item) => url.replace(item.regEx, item.val), ifsUrl);
    }
    return null;
  }
}
