import { ClaimFrequency, getAuthRoles, IContext, ProjectDto, ProjectRole, ProjectStatus } from "@framework/types";
import { dayComparator, isNumber, roundCurrency } from "@framework/util";
import { ISalesforceProject } from "../../repositories/projectsRepository";

export const mapToProjectDto = (context: IContext, item: ISalesforceProject, roles: ProjectRole): ProjectDto => {
  const claimFrequency = mapFrequencyToEnum(item.Acc_ClaimFrequency__c);
  // TODO change this to parseRequiredSalesforceDate and update tests to pass
  const startDate = context.clock.parseOptionalSalesforceDate(item.Acc_StartDate__c) as Date;
  const endDate = context.clock.parseOptionalSalesforceDate(item.Acc_EndDate__c) as Date;

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
    claimedPercentage: item.Acc_GOLTotalCostAwarded__c
      ? roundCurrency((100 * item.Acc_TotalProjectCosts__c) / item.Acc_GOLTotalCostAwarded__c)
      : null,
    startDate,
    endDate,
    periodId: item.Acc_CurrentPeriodNumber__c,
    periodStartDate: context.clock.parseOptionalSalesforceDate(item.Acc_CurrentPeriodStartDate__c),
    periodEndDate: context.clock.parseOptionalSalesforceDate(item.Acc_CurrentPeriodEndDate__c),
    pcrsToReview: item.Acc_PCRsForReview__c || 0,
    pcrsQueried: item.Acc_PCRsUnderQuery__c || 0,
    roles: roles || ProjectRole.Unknown,
    roleTitles: getRoleTitles(roles || ProjectRole.Unknown),
    status: getProjectStatus(item.Acc_ProjectStatus__c),
    statusName: item.ProjectStatusName,
    claimsOverdue: item.Acc_ClaimsOverdue__c,
    claimsToReview: item.Acc_ClaimsForReview__c,
    claimsWithParticipant: item.Acc_ClaimsUnderQuery__c,
    numberOfOpenClaims: item.Acc_NumberOfOpenClaims__c,
    durationInMonths: item.Acc_Duration__c,
    numberOfPeriods: isNumber(item.Acc_NumberofPeriods__c) ? item.Acc_NumberofPeriods__c : 0,
    isNonFec: item.Acc_NonFEC__c,

    loanEndDate: context.clock.parseOptionalSalesforceDate(item.Loan_LoanEndDate__c),
    loanAvailabilityPeriodLength: item.Loan_LoanAvailabilityPeriodLength__c ?? null,
    loanExtensionPeriodLength: item.Loan_LoanExtensionPeriodLength__c ?? null,
    loanRepaymentPeriodLength: item.Loan_LoanRepaymentPeriodLength__c ?? null,
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
  const { isMo, isPm, isFc } = getAuthRoles(roles);
  const results: string[] = [];

  if (isMo) results.push("Monitoring Officer");
  if (isPm) results.push("Project Manager");
  if (isFc) results.push("Finance Contact");

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
    return (Object.keys(project) as (keyof ISalesforceProject)[])
      .map(key => ({ regEx: new RegExp(`<<${key}>>`, "g"), val: project[key] }))
      .reduce((url, item) => url.replace(item.regEx, String(item.val)), ifsUrl);
  }
  return null;
};
