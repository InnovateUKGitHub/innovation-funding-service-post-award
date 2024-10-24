import { ClaimFrequency } from "@framework/constants/enums";
import { ProjectRolePermissionBits, ProjectSource } from "@framework/constants/project";
import { ProjectDto } from "@framework/dtos/projectDto";
import { mapImpactManagementParticipationToEnum } from "@framework/mappers/impactManagementParticipation";
import { getMonitoringLevel } from "@framework/mappers/projectMonitoringLevel";
import { getProjectStatus } from "@framework/mappers/projectStatus";
import { getAuthRoles } from "@framework/types/authorisation";
import { IContext } from "@framework/types/IContext";
import { dayComparator } from "@framework/util/comparator";
import { isNumber, roundCurrency } from "@framework/util/numberHelper";
import { ISalesforceProject } from "../../repositories/projectsRepository";

export const mapToProjectDto = (
  context: IContext,
  item: ISalesforceProject,
  roles: ProjectRolePermissionBits,
): ProjectDto => {
  const claimFrequency = mapFrequencyToEnum(item.Acc_ClaimFrequency__c);
  // TODO change this to parseRequiredSalesforceDate and update tests to pass
  const startDate = context.clock.parseOptionalSalesforceDate(item.Acc_StartDate__c);
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
    periodId: item.Acc_CurrentPeriodNumber__c as PeriodId,
    periodStartDate: context.clock.parseOptionalSalesforceDate(item.Acc_CurrentPeriodStartDate__c),
    periodEndDate: context.clock.parseOptionalSalesforceDate(item.Acc_CurrentPeriodEndDate__c),
    pcrsToReview: item.Acc_PCRsForReview__c || 0,
    pcrsQueried: item.Acc_PCRsUnderQuery__c || 0,
    roles: roles || ProjectRolePermissionBits.Unknown,
    roleTitles: getRoleTitles(roles || ProjectRolePermissionBits.Unknown),
    status: getProjectStatus(item.Acc_ProjectStatus__c),
    statusName: item.ProjectStatusName,
    claimsOverdue: item.Acc_ClaimsOverdue__c,
    claimsToReview: item.Acc_ClaimsForReview__c,
    claimsWithParticipant: item.Acc_ClaimsUnderQuery__c,
    numberOfOpenClaims: item.Acc_NumberOfOpenClaims__c,
    durationInMonths: item.Acc_Duration__c,
    numberOfPeriods: isNumber(item.Acc_NumberofPeriods__c) ? item.Acc_NumberofPeriods__c : 0,
    isNonFec: item.Acc_NonFEC__c,
    monitoringLevel: getMonitoringLevel(item.Acc_MonitoringLevel__c),

    loanEndDate: context.clock.parseOptionalSalesforceDate(item.Loan_LoanEndDate__c),
    loanAvailabilityPeriodLength: item.Loan_LoanAvailabilityPeriodLength__c ?? null,
    loanExtensionPeriodLength: item.Loan_LoanExtensionPeriodLength__c ?? null,
    loanRepaymentPeriodLength: item.Loan_LoanRepaymentPeriodLength__c ?? null,
    impactManagementParticipation: mapImpactManagementParticipationToEnum(
      item.Impact_Management_Participation__c ?? null,
    ),
    projectSource: (item.Acc_ProjectSource__c as ProjectSource) ?? ProjectSource.Unknown,
  };
};

const getRoleTitles = (roles: ProjectRolePermissionBits) => {
  const { isMo, isPm, isFc, isAssociate } = getAuthRoles(roles);
  const results: string[] = [];

  if (isMo) results.push("Monitoring Officer");
  if (isPm) results.push("Project Manager");
  if (isFc) results.push("Finance Contact");
  if (isAssociate) results.push("Associate");

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
