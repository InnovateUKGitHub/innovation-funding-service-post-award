// tslint:disable:no-bitwise
import { GetPeriodInfoQuery } from "./";
import { ISalesforceProject } from "../../repositories/projectsRepository";
import { ClaimFrequency, IContext, ProjectDto, ProjectRole, ProjectStatus } from "@framework/types";
import { dayComparator } from "@framework/util";

export const mapToProjectDto = (context: IContext, item: ISalesforceProject, roles: ProjectRole): ProjectDto => {
  const claimFrequency = mapFrequencyToEnum(item.Acc_ClaimFrequency__c);
  // TODO change this to parseRequiredSalesforceDate and update tests to pass
  const startDate = context.clock.parseOptionalSalesforceDate(item.Acc_StartDate__c)!;
  const endDate = context.clock.parseOptionalSalesforceDate(item.Acc_EndDate__c)!;
  const periodInfo = context.runSyncQuery(new GetPeriodInfoQuery(startDate, endDate, claimFrequency));

  return {
    id: item.Id,
    title: item.Acc_ProjectTitle__c,
    summary: item.Acc_ProjectSummary__c,
    description: item.Acc_PublicDescription__c,
    projectNumber: item.Acc_ProjectNumber__c,
    applicationUrl: getIFSUrl(item, context.config.urls.ifsApplicationUrl),
    grantOfferLetterUrl: getIFSUrl(item, context.config.urls.ifsGrantLetterUrl),
    leadPartnerName: item.Acc_LeadParticipantName__c,
    isPastEndDate: dayComparator(endDate, new Date()) < 0,
    claimFrequency,
    claimFrequencyName: ClaimFrequency[claimFrequency],
    grantOfferLetterCosts: item.Acc_GOLTotalCostAwarded__c,
    costsClaimedToDate: item.Acc_TotalProjectCosts__c,
    competitionType: item.Acc_CompetitionType__c,
    claimedPercentage: item.Acc_GOLTotalCostAwarded__c ? 100 * item.Acc_TotalProjectCosts__c / item.Acc_GOLTotalCostAwarded__c : null,
    startDate,
    endDate,
    periodId: periodInfo.current,
    periodStartDate: periodInfo.startDate,
    periodEndDate: periodInfo.endDate,
    pcrsToReview: item.Acc_PCRsForReview__c || 0,
    pcrsQueried: item.Acc_PCRsUnderQuery__c || 0,
    // TODO use either totalPeriods OR numberOfPeriods
    totalPeriods: periodInfo.total,
    claimWindowStart: periodInfo.currentClaimWindowStart,
    claimWindowEnd: periodInfo.currentClaimWindowEnd,
    roles: roles || ProjectRole.Unknown,
    roleTitles: getRoleTitles(roles || ProjectRole.Unknown),
    status: getProjectStatus(item.Acc_ProjectStatus__c),
    statusName: item.ProjectStatusName,
    claimsOverdue: item.Acc_ClaimsOverdue__c,
    claimsToReview: item.Acc_ClaimsForReview__c,
    claimsWithParticipant: item.Acc_ClaimsUnderQuery__c,
    numberOfOpenClaims: item.Acc_NumberOfOpenClaims__c,
    durationInMonths: item.Acc_Duration__c,
    numberOfPeriods: item.Acc_NumberofPeriods__c,
  };
};

const getProjectStatus = (salesforceProjectStatus: string): ProjectStatus => {
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
};

const getRoleTitles = (roles: ProjectRole) => {
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
};

const mapFrequencyToEnum = (freq: string): ClaimFrequency => {
  switch (freq) {
    case "Quarterly":
      return ClaimFrequency.Quarterly;
    case "Monthly":
      return ClaimFrequency.Monthly;
    default:
      return ClaimFrequency.Unknown;
  }
};

const getIFSUrl = (project: ISalesforceProject, ifsUrl: string): string | null => {
  if (ifsUrl && project.Acc_ProjectSource__c === "IFS") {
    /// foreach prop in project build regex replacing <<PROP_NAME>> with value and then replace the expected value in string
    return Object.keys(project)
      .map(key => ({ regEx: new RegExp(`<<${key}>>`, "g"), val: (project as any)[key] }))
      .reduce((url, item) => url.replace(item.regEx, item.val), ifsUrl);
  }
  return null;
};
