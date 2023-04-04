import { fuzzySearch } from "@framework/util/fuzzySearch";
import { SelectOption } from "@ui/components";
import { useContent } from "@ui/hooks";
import { IPartner, IProject } from "./Dashboard.interface";
import { getProjectSection, IDashboardProjectData } from "./DashboardProject";

/**
 * Get the filter options to allow a user to filter projects.
 * Filter options depend on the roles that a user has.
 *
 * @returns The checkbox options a user can use to filter projects
 */
const getFilterOptions = ({ projects }: { projects: IDashboardProjectData[] }): SelectOption[] => {
  // Start off with no options
  const filterOptions: SelectOption[] = [];

  // Check if the user is any of the following roles.
  const isAnyMo = projects.some(x => x.project.roles.isMo);
  const isAnyFc = projects.some(x => x.project.roles.isFc);
  const isAnyPm = projects.some(x => x.project.roles.isPm);

  // PCRS
  if (isAnyMo) filterOptions.push({ id: "PCRS_TO_REVIEW", value: "PCR's to review" });
  if (isAnyPm) filterOptions.push({ id: "PCRS_QUERIED", value: "PCR's being queried" });

  // Claims, then Setup Required
  if (isAnyMo) filterOptions.push({ id: "CLAIMS_TO_REVIEW", value: "Claims to review" });
  if (isAnyFc)
    filterOptions.push(
      { id: "CLAIMS_TO_SUBMIT", value: "Claims to submit" },
      { id: "CLAIMS_TO_UPLOAD_REPORT", value: "Claims missing documents" },
      { id: "CLAIMS_TO_RESPOND", value: "Claims needing responses" },
      { id: "SETUP_REQUIRED", value: "Not completed setup" },
    );

  return filterOptions;
};

/**
 * Filter and sort projects.
 *
 * @returns A set of filtered projects, ordered into categories.
 */
const getFilteredProjects = ({
  searchQuery,
  pcrsQueried,
  claimsToReview,
  pcrsToReview,
  setupRequired,
  claimsToSubmit,
  claimsToUploadReport,
  claimsToRespond,
  projects,
}: {
  searchQuery: string;
  pcrsQueried: boolean;
  claimsToReview: boolean;
  pcrsToReview: boolean;
  setupRequired: boolean;
  claimsToSubmit: boolean;
  claimsToUploadReport: boolean;
  claimsToRespond: boolean;
  projects: IDashboardProjectData[];
}) => {
  // Only display the "filtering" messages if any filter options are enabled.
  const isFiltering =
    pcrsQueried ||
    claimsToReview ||
    pcrsToReview ||
    setupRequired ||
    claimsToSubmit ||
    claimsToUploadReport ||
    claimsToRespond;

  // If filter options are selected, perform filtering.
  // Otherwise, if all filters are missing, use all projects.
  const filteredProjects = isFiltering
    ? projects.filter(({ project, partner, projectSection }) => {
        if (pcrsQueried && project.Acc_PCRsUnderQuery__c!.value! > 0) return true;
        if (claimsToReview && project.Acc_ClaimsForReview__c!.value! > 0) return true;
        if (pcrsToReview && project.Acc_PCRsForReview__c!.value! > 0) return true;
        if (setupRequired && projectSection === "pending") return true;

        const { isFc } = project.roles;
        if (isFc && partner) {
          if (claimsToRespond && partner.Acc_TrackingClaims__c?.value === "Claim Queried") return true;
          if (claimsToSubmit && partner.Acc_TrackingClaims__c?.value === "Claim Due") return true;
          if (claimsToRespond && partner.Acc_TrackingClaims__c?.value === "Awaiting IAR") return true;
        }

        return false;
      })
    : projects;

  const searchedProjects = searchQuery
    ? fuzzySearch(searchQuery.trim(), filteredProjects, [
        "project.Acc_ProjectTitle__c.value",
        "project.Acc_ProjectNumber__c.value",
        "project.Acc_LeadParticipantName__c.value",
        "partner.Acc_AccountId__r.Name.value",
      ]).map(x => x.item)
    : filteredProjects;

  // Sort projects into their corresponding categories.
  const currentProjects = searchedProjects.filter(x => ["open", "pending", "awaiting"].includes(x.projectSection));
  const openAndAwaitingProjects = searchedProjects.filter(x => ["open", "awaiting"].includes(x.projectSection));
  const pendingProjects = searchedProjects.filter(x => ["pending"].includes(x.projectSection));
  const upcomingProjects = searchedProjects.filter(x => ["upcoming"].includes(x.projectSection));
  const archivedProjects = searchedProjects.filter(x => ["archived"].includes(x.projectSection));

  return {
    currentProjects,
    openAndAwaitingProjects,
    pendingProjects,
    upcomingProjects,
    archivedProjects,
    isFiltering,
  };
};

/**
 * For a given project (with an optional partner associated with the user),
 * display messages that a user will need to act on the project.
 *
 * @returns An array of internationalised strings.
 */
const useProjectActions = ({
  project,
  partner,
  projectSection,
}: {
  project: IProject;
  partner?: IPartner | null;
  projectSection: ReturnType<typeof getProjectSection>;
}): string[] => {
  const { getContent } = useContent();
  const { isMo, isFc, isPm } = project.roles;

  const messages: string[] = [];

  if (projectSection === "pending") {
    messages.push(getContent(x => x.projectMessages.pendingProject));
  }

  if (projectSection === "archived") {
    messages.push(project.Acc_ProjectStatus__c!.value!);
  }

  if (["open", "awaiting"].includes(projectSection)) {
    const isProjectOnHold = project.Acc_ProjectStatus__c?.value === "On Hold";
    const hasQueriedPcrs = project.Acc_PCRsUnderQuery__c!.value! > 0;

    if (isProjectOnHold) {
      messages.push(getContent(x => x.projectMessages.projectOnHold));
    }

    if (isFc && partner) {
      if (partner.Acc_NewForecastNeeded__c?.value) {
        messages.push(getContent(x => x.projectMessages.checkForecast));
      }

      switch (partner.Acc_TrackingClaims__c?.value) {
        case "Claim Due":
          messages.push(getContent(x => x.projectMessages.claimToSubmitMessage));
          break;
        case "Claims Overdue":
          messages.push(getContent(x => x.projectMessages.claimOverdueMessage));
          break;
        case "Claim Queried":
          messages.push(getContent(x => x.projectMessages.claimQueriedMessage));
          break;
        case "Awaiting IAR":
          messages.push(getContent(x => x.projectMessages.claimRequestMissingDocument));
          break;
      }
    }

    if (isMo) {
      if (project.Acc_ClaimsForReview__c?.value) {
        messages.push(
          getContent(x => x.projectMessages.claimsToReviewMessage({ count: project.Acc_ClaimsForReview__c?.value })),
        );
      }
      if (project.Acc_ClaimsOverdue__c?.value) {
        const content = getContent(x => x.projectMessages.claimOverdueMessage);
        if (!messages.includes(content)) messages.push(content);
      }
      if (project.Acc_PCRsForReview__c?.value) {
        messages.push(getContent(x => x.projectMessages.pcrsToReview({ count: project.Acc_PCRsForReview__c?.value })));
      }
    }

    if (isPm && hasQueriedPcrs) {
      messages.push(getContent(x => x.projectMessages.pcrQueried));
    }
  }

  return messages;
};

export { getFilterOptions, getFilteredProjects, useProjectActions };
