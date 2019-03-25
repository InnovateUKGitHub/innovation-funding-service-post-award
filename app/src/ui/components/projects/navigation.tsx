import React from "react";
import { PartnerDto, ProjectDto, ProjectRole } from "../../../types";
import { Section, TabItem, Tabs } from "../layout";
import { Link } from "../links";
import {
  AllClaimsDashboardRoute,
  ClaimsDashboardRoute,
  ProjectChangeRequestsRoute,
  ProjectDetailsRoute,
  ProjectDocumentsRoute,
  ProjectForecastRoute,
  ViewForecastRoute,
} from "../../containers";

interface Props {
  project: ProjectDto;
  currentRoute: string;
  partners: PartnerDto[];
}

export const ProjectNavigation: React.SFC<Props> = ({ project, currentRoute, partners }) => {

  const projectId = project.id;
  const partnerId = partners.filter(x => x.roles & ProjectRole.FinancialContact).map(x => x.id)[0];

  // potential links
  const claimsLink = ClaimsDashboardRoute.getLink({ projectId, partnerId });
  const allClaimsLink = AllClaimsDashboardRoute.getLink({ projectId });
  const viewForecastLink = ViewForecastRoute.getLink({ projectId, partnerId });
  const projectForecastsLink = ProjectForecastRoute.getLink({ projectId });
  const projectChangeRequestLink = ProjectChangeRequestsRoute.getLink({ projectId });
  const projectDocumentsLink = ProjectDocumentsRoute.getLink({projectId});

  // roles
  const isFC = !!(project.roles & ProjectRole.FinancialContact);
  const isMOorPM = !!(project.roles & (ProjectRole.MonitoringOfficer | ProjectRole.ProjectManager));
  const isMO = !!(project.roles & ProjectRole.MonitoringOfficer);

  // add tabs conditionally
  const navigationTabs: TabItem[] = [];

  if (isMOorPM) {
    navigationTabs.push({ text: "Claims", route: allClaimsLink, selected: allClaimsLink.routeName === currentRoute, qa: "allClaimsTab" });
    navigationTabs.push({ text: "Forecasts", route: projectForecastsLink, selected: projectForecastsLink.routeName === currentRoute, qa: "allForecastsTab" });
  }

  else if (isFC) {
    navigationTabs.push({ text: "Claims", route: claimsLink, selected: claimsLink.routeName === currentRoute, qa: "claimsTab" });
    navigationTabs.push({ text: "Forecast", route: viewForecastLink, selected: viewForecastLink.routeName === currentRoute, qa: "forecastTab" });
  }

  navigationTabs.push({ text: "Project change requests", route: projectChangeRequestLink, selected: projectChangeRequestLink.routeName === currentRoute, qa: "changeRequestsTab" });

  if (isMO) {
    navigationTabs.push({ text: "Documents", route: projectDocumentsLink, selected: projectDocumentsLink.routeName === currentRoute, qa: "documentsTab" });
  }

  return (
    <React.Fragment>
      <Section qa="projectDetailsLink">
        <Link className="govuk-!-font-size-19" route={ProjectDetailsRoute.getLink({ id: projectId })}>Contact details and project summary</Link>
      </Section>
      <Tabs tabList={navigationTabs} qa="project-navigation" />
    </React.Fragment>
  );

};
