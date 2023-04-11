import { fuzzySearch } from "@framework/util/fuzzySearch";
import { getAuthRoles, PartnerClaimStatus, PartnerStatus, ProjectStatus } from "@framework/types";
import { projectPriorityComparator } from "@framework/util";
import { mapToPartnerDtoArray, mapToProjectDto } from "@gql/dtoMapper";
import { useLazyLoadQuery } from "react-relay";

import { CuratedSection, CuratedSections, Section, FilterOptions, Project, Partner } from "./Dashboard.interface";
import { projectDashboardQuery } from "./Dashboard.query";
import { DashboardProjectDashboardQuery } from "./__generated__/DashboardProjectDashboardQuery.graphql";

/**
 * filter function for a reducer.
 */
function filterReducer(
  types: FilterOptions[],
  sectionState: Section,
  project: Project,
  partner: Partner | undefined,
): boolean {
  if (!types.length) return true;

  // Note: Hide anything that does not match a filter
  let matchesFilter = false;

  const state = new Set(types);
  const { isFc, isMo, isPm } = getAuthRoles(project.roles);

  if (isPm && state.has("PCRS_QUERIED")) {
    matchesFilter ||= project.pcrsQueried > 0;
  }

  if (isMo && state.has("CLAIMS_TO_REVIEW")) {
    matchesFilter ||= project.claimsToReview > 0;
  }

  if (isMo && state.has("PCRS_TO_REVIEW")) {
    matchesFilter ||= project.pcrsToReview > 0;
  }

  if (isFc && state.has("SETUP_REQUIRED")) {
    matchesFilter ||= sectionState === "pending";
  }

  if (isFc && partner) {
    if (state.has("CLAIMS_TO_RESPOND")) {
      matchesFilter ||= partner.claimStatus === PartnerClaimStatus.ClaimQueried;
    }

    if (state.has("CLAIMS_TO_SUBMIT")) {
      matchesFilter ||= partner.claimStatus === PartnerClaimStatus.ClaimDue;
    }

    if (state.has("CLAIMS_TO_UPLOAD_REPORT")) {
      matchesFilter ||= partner.claimStatus === PartnerClaimStatus.IARRequired;
    }
  }

  return matchesFilter;
}

interface ProjectFilterOption {
  id: FilterOptions;
  label: string;
}

/**
 * gets filter types for projects
 */
export function getAvailableProjectFilters(projects: Project[]): ProjectFilterOption[] {
  if (!projects.length) return [];

  // Start off with no options
  const filterOptions: ProjectFilterOption[] = [];

  // Check if the user is any of the following roles.
  const isAnyMo = projects.some(x => getAuthRoles(x.roles).isMo);
  const isAnyFc = projects.some(x => getAuthRoles(x.roles).isFc);
  const isAnyPm = projects.some(x => getAuthRoles(x.roles).isPm);

  // PCRS
  if (isAnyMo) filterOptions.push({ id: "PCRS_TO_REVIEW", label: "PCR's to review" });
  if (isAnyPm) filterOptions.push({ id: "PCRS_QUERIED", label: "PCR's being queried" });

  // Claims, then Setup Required
  if (isAnyMo) filterOptions.push({ id: "CLAIMS_TO_REVIEW", label: "Claims to review" });
  if (isAnyFc)
    filterOptions.push(
      { id: "CLAIMS_TO_SUBMIT", label: "Claims to submit" },
      { id: "CLAIMS_TO_UPLOAD_REPORT", label: "Claims missing documents" },
      { id: "CLAIMS_TO_RESPOND", label: "Claims needing responses" },
      { id: "SETUP_REQUIRED", label: "Not completed setup" },
    );

  return filterOptions;
}

/**
 * filters projects to only those we need
 */
export function generateFilteredProjects(filters: FilterOptions[], projects: Project[]) {
  let totalProjects = 0;

  const curatedTotals: CuratedSection<number> = {
    open: 0,
    pending: 0,
    upcoming: 0,
    archived: 0,
  };

  const curatedProjects: CuratedSection<{ curatedSection: Section; project: Project; partner?: Partner }[]> = {
    open: [],
    pending: [],
    upcoming: [],
    archived: [],
  };

  for (const project of projects) {
    const projectPartner = getPartnerOnProject(project);

    const curatedSection = getProjectSection(project, projectPartner);
    const canFilterProject = filterReducer(filters, curatedSection, project, projectPartner);

    if (!canFilterProject) continue;

    // Note: Only allow curated keys, not all sections match ui sections
    const key: CuratedSections = curatedSection === "awaiting" ? "open" : curatedSection;

    curatedProjects[key].push({ curatedSection, project, partner: projectPartner });
    curatedTotals[key] += 1;
    totalProjects += 1;
  }

  // Note: Sort only open projects
  curatedProjects.open.sort((a, b) => projectPriorityComparator(a.project, b.project));

  return {
    totalProjects,
    curatedTotals,
    curatedProjects,
  };
}

/**
 * gets the partner roles for the partner when given a set of partner roles for a project
 */
export function getRolesForPartner(partner: Partner, partnerRoles: SfPartnerRoles[]): SfRoles {
  return (
    partnerRoles.find(x => x.partnerId === partner.projectId) ?? {
      isFc: false,
      isPm: false,
      isMo: false,
    }
  );
}

/**
 * @description MO's do not have roles partners only projects - we only get FC/PM/PM & FC
 */
export function getPartnerOnProject(project: Project): Partner | undefined {
  const { isPm } = getAuthRoles(project.roles);

  const leadPartner = project.partners.find(partner => partner.projectId === project.leadPartnerId);

  if (leadPartner && (isPm || getRolesForPartner(leadPartner, project?.partnerRoles)?.isFc)) {
    return leadPartner;
  }

  return project.partners.find(partner => getRolesForPartner(partner, project.partnerRoles)?.isFc);
}

/**
 * gets projects for the section
 */
export function getProjectSection(project: Project, partner?: Partner): Section {
  if (partner?.partnerStatus === PartnerStatus.Pending && getRolesForPartner(partner, project.partnerRoles).isFc) {
    return "pending";
  }

  const { isFc, isPmOrMo } = getAuthRoles(project.roles);

  switch (project.status) {
    case ProjectStatus.Live:
    case ProjectStatus.FinalClaim:
    case ProjectStatus.OnHold:
      if (project.periodId === 0) {
        return "upcoming";
      }

      if (isPmOrMo) {
        return project.numberOfOpenClaims > 0 ? "open" : "awaiting";
      }

      if (isFc && partner) {
        const hasNoClaimsDue = partner.claimStatus === PartnerClaimStatus.NoClaimsDue;
        return hasNoClaimsDue ? "awaiting" : "open";
      }

      return "upcoming";

    case ProjectStatus.Closed:
    case ProjectStatus.Terminated:
      return "archived";

    default:
      return "upcoming";
  }
}

const getFilteredProjects = (filteredProjects: Project[], searchQuery?: string | null): Project[] => {
  return searchQuery
    ? fuzzySearch(searchQuery.trim(), filteredProjects, ["title", "projectNumber", "leadPartnerName"]).map(x => x.item)
    : filteredProjects;
};

export const useProjectsDashboardData = (search: string | number) => {
  const data = useLazyLoadQuery<DashboardProjectDashboardQuery>(projectDashboardQuery, {});
  const projectsGql = data?.salesforce?.uiapi?.query?.Acc_Project__c?.edges ?? [];
  const unfilteredObjects = projectsGql.map(x => ({
    ...mapToProjectDto(x?.node ?? null, [
      "claimsOverdue",
      "claimsToReview",
      "endDate",
      "id",
      "isPastEndDate",
      "leadPartnerId",
      "leadPartnerName",
      "numberOfOpenClaims",
      "numberOfPeriods",
      "partnerRoles",
      "pcrsQueried",
      "pcrsToReview",
      "periodEndDate",
      "periodId",
      "periodStartDate",
      "projectNumber",
      "roles",
      "startDate",
      "status",
      "statusName",
      "title",
    ]),
    partners: mapToPartnerDtoArray(
      x?.node?.Acc_ProjectParticipantsProject__r?.edges ?? [],
      ["id", "claimStatus", "partnerStatus", "newForecastNeeded", "name", "isWithdrawn", "isLead", "projectId"],
      {},
    ),
  }));
  const projects = getFilteredProjects(unfilteredObjects, search.toString());

  return { unfilteredObjects, totalNumberOfProjects: unfilteredObjects?.length ?? 0, projects };
};
