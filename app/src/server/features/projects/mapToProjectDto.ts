// tslint:disable:no-bitwise
import { CommandBase } from "../common/commandBase";
import { ISalesforceProject } from "../../repositories/projectsRepository";
import { ClaimFrequency, ProjectDto, ProjectRole } from "../../../types";
import { GetPeriodInfoQuery } from ".";
import { IContext } from "../../../types/IContext";

export class MapToProjectDtoCommand extends CommandBase<ProjectDto> {
  constructor(readonly item: ISalesforceProject, readonly roles: ProjectRole) {
    super();
   }

  protected LogMessage() {
    return ["MapToProjectDtoCommand", {id: this.item.Id, role: this.roles}];
  }

  protected async Run(context: IContext) {
    const claimFrequency = this.mapFrequencyToEnum(this.item.Acc_ClaimFrequency__c);
    const startDate = context.clock.parse(this.item.Acc_StartDate__c, "yyyy-MM-dd")!;
    const endDate = context.clock.parse(this.item.Acc_EndDate__c, "yyyy-MM-dd")!;
    const periodInfo = context.runSyncQuery(new GetPeriodInfoQuery(startDate, endDate, claimFrequency));

    const dto: ProjectDto = {
      id: this.item.Id,
      title: this.item.Acc_ProjectTitle__c,
      summary: this.item.Acc_ProjectSummary__c,
      projectNumber: this.item.Acc_ProjectNumber__c,
      applicationUrl: this.getIFSUrl(this.item, context.config.ifsApplicationUrl),
      grantOfferLetterUrl: this.getIFSUrl(this.item, context.config.ifsGrantLetterUrl),
      claimFrequency,
      claimFrequencyName: ClaimFrequency[claimFrequency],
      grantOfferLetterCosts: this.item.Acc_GOLTotalCostAwarded__c,
      costsClaimedToDate: this.item.Acc_TotalProjectCosts__c,
      claimedPercentage: this.item.Acc_GOLTotalCostAwarded__c ? 100 * this.item.Acc_TotalProjectCosts__c / this.item.Acc_GOLTotalCostAwarded__c : null,
      startDate,
      endDate,
      periodId: periodInfo.current,
      periodStartDate: periodInfo.startDate,
      periodEndDate: periodInfo.endDate,
      totalPeriods: periodInfo.total,
      roles: this.roles || ProjectRole.Unknown,
      roleTitles: this.getRoleTitles()
    };

    return Promise.resolve(dto);
  }

  private getRoleTitles() {
    const roles = this.roles || ProjectRole.Unknown;
    const results: string[] = [];
    if((roles & ProjectRole.MonitoringOfficer) === ProjectRole.MonitoringOfficer) {
      results.push("Monitoring Officer");
    }
    if((roles & ProjectRole.ProjectManager) === ProjectRole.ProjectManager) {
      results.push("Project Manager");
    }
    if((roles & ProjectRole.FinancialContact) === ProjectRole.FinancialContact) {
      results.push("Finance Contact");
    }
    return results;
  }

  mapFrequencyToEnum(freq: string): ClaimFrequency {
    switch(freq) {
      case "Quarterly": return ClaimFrequency.Quarterly;
      case "Monthly":   return ClaimFrequency.Monthly;
      default:          return ClaimFrequency.Unknown;
    }
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
