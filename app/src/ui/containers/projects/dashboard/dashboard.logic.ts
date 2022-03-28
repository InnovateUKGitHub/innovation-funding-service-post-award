import {
  getAuthRoles,
  PartnerClaimStatus,
  PartnerDto,
  PartnerStatus,
  ProjectDto,
  ProjectStatus,
} from "@framework/types";
import { projectPriorityComparator } from "@framework/util";

import { CuratedSection, CuratedSections, ProjectData, Section, FilterOptions } from "./Dashboard.interface";

function filterReducer(
  types: FilterOptions[],
  sectionState: Section,
  project: ProjectDto,
  partner: PartnerDto | undefined,
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

const projectFilters: Record<"fc" | "mo" | "pm", ProjectFilterOption[]> = {
  pm: [{ id: "PCRS_QUERIED", label: "PCR's being queried" }],
  mo: [
    { id: "CLAIMS_TO_REVIEW", label: "Claims to review" },
    { id: "PCRS_TO_REVIEW", label: "PCR's to review" },
  ],
  fc: [
    { id: "SETUP_REQUIRED", label: "Not completed setup" },
    { id: "CLAIMS_TO_SUBMIT", label: "Claims to submit" },
    { id: "CLAIMS_TO_UPLOAD_REPORT", label: "Claims missing documents" },
    { id: "CLAIMS_TO_RESPOND", label: "Claims needing responses" },
  ],
};

export function getAvailableProjectFilters(projects: ProjectDto[]): ProjectFilterOption[] {
  if (!projects.length) return [];

  // Note: If the first role is a super admin then all projects are the same
  const { isSuperAdmin } = getAuthRoles(projects[0].roles);

  if (isSuperAdmin) {
    return [...projectFilters.pm, ...projectFilters.mo, ...projectFilters.fc];
  }

  let filters: ProjectFilterOption[] = [];

  if (projects.find(x => getAuthRoles(x.roles).isPm)) filters = [...filters, ...projectFilters.pm];
  if (projects.find(x => getAuthRoles(x.roles).isMo)) filters = [...filters, ...projectFilters.mo];
  if (projects.find(x => getAuthRoles(x.roles).isFc)) filters = [...filters, ...projectFilters.fc];

  return filters;
}

export function generateFilteredProjects(filters: FilterOptions[], projects: ProjectDto[], partners: PartnerDto[]) {
  let totalProjects: number = 0;

  // TODO: Refactor to use a template literal interface when TSC 4.1 has been upgraded = [key in ${CuratedSections}Total]
  const curatedTotals: CuratedSection<number> = {
    open: 0,
    pending: 0,
    upcoming: 0,
    archived: 0,
  };

  const curatedProjects: CuratedSection<ProjectData[]> = {
    open: [],
    pending: [],
    upcoming: [],
    archived: [],
  };

  for (const project of projects) {
    const projectPartner = getPartnerOnProject(project, partners);

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
 * @description MO's do not have roles partners only projects - we only get FC/PM/PM & FC
 */
export function getPartnerOnProject(project: ProjectDto, partners: PartnerDto[]): PartnerDto | undefined {
  const { isPm } = getAuthRoles(project.roles);

  return partners.find(partner => {
    if (partner.projectId !== project.id) return false;

    return isPm ? partner.isLead : getAuthRoles(partner.roles).isFc;
  });
}

export function getProjectSection(project: ProjectDto, partner?: PartnerDto): Section {
  // Note: Pending participant are always prioritised - check project status
  if (partner?.partnerStatus === PartnerStatus.Pending && getAuthRoles(partner.roles).isFc) {
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
