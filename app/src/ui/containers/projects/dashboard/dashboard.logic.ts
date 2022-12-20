import { fuzzySearch } from "@framework/util/fuzzySearch";
import { AllRoles, useProjectRolesFragment } from "@gql/hooks/useProjectRolesQuery";
import { SelectOption } from "@ui/components";
import { useContent } from "@ui/hooks";
import { IPartner, IProject } from "./Dashboard.interface";
import { getProjectSection, IDashboardProjectData } from "./DashboardProject";

/**
 * Get the filter options to allow a user to filter projects.
 * Filter options depend on the roles that a user has.
 *
 * @author Leondro Lio <leondro.lio@iuk.ukri.org>
 * @returns The checkbox options a user can use to filter projects
 */
const getFilterOptions = ({
  projects,
  roles,
}: {
  projects: IDashboardProjectData[];
  roles: ReturnType<typeof useProjectRolesFragment>;
}): SelectOption[] => {
  // Start off with no options
  const filterOptions: SelectOption[] = [];

  const isAnyMo = projects.some(x => roles[x.project.id]?.projectRoles.isMo);
  const isAnyFc = projects.some(x => roles[x.project.id]?.projectRoles.isFc);
  const isAnyPm = projects.some(x => roles[x.project.id]?.projectRoles.isPm);

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
 * @author Leondro Lio <leondro.lio@iuk.ukri.org>
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
  roles,
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
  roles: ReturnType<typeof useProjectRolesFragment>;
}) => {
  // Only display "filtering" messages if any filter options are enabled.
  const isFiltering =
    pcrsQueried ||
    claimsToReview ||
    pcrsToReview ||
    setupRequired ||
    claimsToSubmit ||
    claimsToUploadReport ||
    claimsToRespond;

  // If filters are enabled, perform filtering.
  // Otherwise, if all filters are missing, use all projects.
  const filteredProjects = isFiltering
    ? projects.filter(({ project, partner, projectSection }) => {
        if (pcrsQueried && project.accPcRsUnderQueryCustom! > 0) return true;
        if (claimsToReview && project.accClaimsForReviewCustom! > 0) return true;
        if (pcrsToReview && project.accPcRsForReviewCustom! > 0) return true;
        if (setupRequired && projectSection === "pending") return true;

        const role = roles[project.id];
        if (role?.projectRoles.isFc && partner) {
          if (claimsToRespond && partner.accTrackingClaimsCustom === "Claim Queried") return true;
          if (claimsToSubmit && partner.accTrackingClaimsCustom === "Claim Due") return true;
          if (claimsToRespond && partner.accTrackingClaimsCustom === "Awaiting IAR") return true;
        }

        return false;
      })
    : projects;

  const searchedProjects = searchQuery
    ? fuzzySearch(searchQuery.trim(), filteredProjects, [
        "project.accProjectTitleCustom",
        "project.accProjectNumberCustom",
        "partner.accAccountIdCustom.name",
      ]).map(x => x.item)
    : filteredProjects;

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

const useProjectActions = ({
  project,
  partner,
  roles,
  projectSection,
}: {
  project: IProject;
  partner?: IPartner;
  roles: AllRoles;
  projectSection: ReturnType<typeof getProjectSection>;
}): string[] => {
  const { getContent } = useContent();
  const isMo = roles[project.id]?.projectRoles.isMo ?? false;
  const isFc = roles[project.id]?.projectRoles.isFc ?? false;
  const isPm = roles[project.id]?.projectRoles.isPm ?? false;

  const messages: string[] = [];

  if (projectSection === "pending") {
    messages.push(getContent(x => x.projectMessages.pendingProject));
  }

  if (projectSection === "archived") {
    messages.push(project.accProjectStatusCustom!);
  }

  if (["open", "awaiting"].includes(projectSection)) {
    const isProjectOnHold = project.accProjectStatusCustom! === "On Hold";
    const hasQueriedPcrs = project.accPcRsUnderQueryCustom! > 0;

    if (isProjectOnHold) {
      messages.push(getContent(x => x.projectMessages.projectOnHold));
    }

    if (isFc && partner) {
      if (partner.accNewForecastNeededCustom) {
        messages.push(getContent(x => x.projectMessages.checkForecast));
      }

      switch (partner.accTrackingClaimsCustom) {
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
      if (project.accClaimsForReviewCustom) {
        messages.push(
          getContent(x => x.projectMessages.claimsToReviewMessage({ count: project.accClaimsForReviewCustom })),
        );
      }
      if (project.accClaimsOverdueCustom) {
        const content = getContent(x => x.projectMessages.claimOverdueMessage);
        if (!messages.includes(content)) messages.push(content);
      }
      if (project.accPcRsForReviewCustom) {
        messages.push(getContent(x => x.projectMessages.pcrsToReview({ count: project.accPcRsForReviewCustom })));
      }
    }

    if (isPm && hasQueriedPcrs) {
      messages.push(getContent(x => x.projectMessages.pcrQueried));
    }
  }

  return messages;
};

export { getFilterOptions, getFilteredProjects, useProjectActions };
