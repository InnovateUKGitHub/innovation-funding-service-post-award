import {
  getAuthRoles,
  PartnerClaimStatus,
  PartnerDto,
  PartnerStatus,
  ProjectDto,
  ProjectStatus,
} from "@framework/types";

import { CuratedSection, CuratedSections, ProjectData, Section } from "./Dashboard.interface";

export function generateFilteredProjects(projects: ProjectDto[], partners: PartnerDto[]) {
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
    const partner = getPartnerOnProject(project, partners);
    const projectSection = getProjectSection(project, partner);

    // Note: Only allow curated keys, not all sections match ui sections
    const key: CuratedSections = projectSection === "awaiting" ? "open" : projectSection;

    curatedProjects[key].push({ project, partner, projectSection });
    curatedTotals[key] += 1;
    totalProjects += 1;
  }

  return {
    totalProjects,
    curatedTotals,
    curatedProjects,
  };
}
export function getPartnerOnProject(project: ProjectDto, partners: PartnerDto[]) {
  const { isPm } = getAuthRoles(project.roles);

  return partners.find(({ projectId, isLead, roles }) => {
    const isPartnerOnProject = projectId === project.id;
    const hasValidRole: boolean = isPm ? isLead : getAuthRoles(roles).isFc;

    return isPartnerOnProject && hasValidRole;
  });
}

// tslint:disable-next-line: cognitive-complexity
export function getProjectSection(project: ProjectDto, partner?: PartnerDto): Section {
  // A pending participant status should override any project status, so check that first
  if (partner && partner.partnerStatus === PartnerStatus.Pending && getAuthRoles(partner.roles).isFc) {
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
        return partner.claimStatus === PartnerClaimStatus.NoClaimsDue ? "awaiting" : "open";
      }

      return "upcoming";

    case ProjectStatus.Closed:
    case ProjectStatus.Terminated:
      return "archived";

    default:
      return "upcoming";
  }
}
