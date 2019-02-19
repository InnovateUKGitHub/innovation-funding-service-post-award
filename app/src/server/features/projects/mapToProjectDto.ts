// tslint:disable:no-bitwise
import { CommandBase } from "../common";
import { GetPeriodInfoQuery } from "./";
import { ISalesforceProject } from "../../repositories/projectsRepository";
import { ClaimFrequency, IContext, ProjectClaimTrackingStatus, ProjectDto, ProjectRole, ProjectStatus } from "../../../types";

export class MapToProjectDtoCommand extends CommandBase<ProjectDto> {
  constructor(private readonly item: ISalesforceProject, private readonly roles: ProjectRole) {
    super();
  }

  protected LogMessage() {
    return ["MapToProjectDtoCommand", { id: this.item.Id, role: this.roles }];
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
      competitionType: this.item.Acc_CompetitionType__c,
      claimedPercentage: this.item.Acc_GOLTotalCostAwarded__c ? 100 * this.item.Acc_TotalProjectCosts__c / this.item.Acc_GOLTotalCostAwarded__c : null,
      startDate,
      endDate,
      periodId: periodInfo.current,
      periodStartDate: periodInfo.startDate,
      periodEndDate: periodInfo.endDate,
      totalPeriods: periodInfo.total,
      claimWindowStart: periodInfo.currentClaimWindowStart,
      claimWindowEnd: periodInfo.currentClaimWindowEnd,
      roles: this.roles || ProjectRole.Unknown,
      roleTitles: this.getRoleTitles(),
      status: this.getProjectStatus(this.item.Acc_ProjectStatus__c),
      statusName: this.item.ProjectStatusName,
      claimsOverdue: this.item.Acc_Claims_Overdue__c,
      claimsToReview: this.item.Acc_Claims_For_Review__c,
      claimsQueried: this.item.Acc_Claims_Under_Query__c,
      claimsStatus: this.getClaimStatus(this.item.Acc_TrackingClaimStatus__c),
      claimsStatusName: this.item.ClaimStatusName,
      numberOfOpenClaims: this.item.Acc_Number_of_Open_Claims__c
    };

    return Promise.resolve(dto);
  }
  getClaimStatus(salesforceClaimStatus: string): ProjectClaimTrackingStatus {
    switch (salesforceClaimStatus) {
      case "No Claims Due":
        return ProjectClaimTrackingStatus.NoClaimsDue;
      case "Claims Due":
        return ProjectClaimTrackingStatus.ClaimsDue;
      case "Claims Overdue":
        return ProjectClaimTrackingStatus.ClaimsOverdue;
      case "Claims Queried":
        return ProjectClaimTrackingStatus.ClaimsQueried;
      case "All Claims Submitted":
        return ProjectClaimTrackingStatus.AllClaimsSubmitted;
      default:
        return ProjectClaimTrackingStatus.Unknown;
    }
  }

  private getProjectStatus(salesforceProjectStatus: string): ProjectStatus {
    switch (salesforceProjectStatus) {
      case "Offer Letter Sent":
        return ProjectStatus.OfferLetterSent;
      case "Live":
        return ProjectStatus.Live;
      case "On Hold":
        return ProjectStatus.OnHold;
      case "Final Claim":
        return ProjectStatus.FinalClaim;
      case "Closed":
        return ProjectStatus.Closed;
      case "Terminated":
        return ProjectStatus.Terminated;
      default:
        return ProjectStatus.Unknown;
    }
  }

  private getRoleTitles() {
    const roles = this.roles || ProjectRole.Unknown;
    const results: string[] = [];
    if ((roles & ProjectRole.MonitoringOfficer) === ProjectRole.MonitoringOfficer) {
      results.push("Monitoring Officer");
    }
    if ((roles & ProjectRole.ProjectManager) === ProjectRole.ProjectManager) {
      results.push("Project Manager");
    }
    if ((roles & ProjectRole.FinancialContact) === ProjectRole.FinancialContact) {
      results.push("Finance Contact");
    }
    return results;
  }

  mapFrequencyToEnum(freq: string): ClaimFrequency {
    switch (freq) {
      case "Quarterly": return ClaimFrequency.Quarterly;
      case "Monthly": return ClaimFrequency.Monthly;
      default: return ClaimFrequency.Unknown;
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
