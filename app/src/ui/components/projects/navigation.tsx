import React from "react";
import { PartnerDto, ProjectDto, ProjectRole } from "@framework/types";
import { Section, TabItem, Tabs } from "../layout";
import { Link } from "../links";
import {
  AllClaimsDashboardRoute,
  ClaimsDashboardRoute,
  MonitoringReportDashboardRoute,
  ProjectChangeRequestsRoute,
  ProjectDetailsRoute,
  ProjectDocumentsRoute,
  ProjectForecastRoute,
  ViewForecastRoute,
} from "../../containers";
import { connect } from "react-redux";
import { RootState } from "../../redux";

interface Props {
  project: ProjectDto;
  currentRoute: string;
  partners: PartnerDto[];
}

class ProjectNavigationComponent extends React.Component<Props> {
  render() {
    const { currentRoute, project, partners } = this.props;
    const projectId = project.id;
    const partnerId = partners.filter(x => x.roles & ProjectRole.FinancialContact).map(x => x.id)[0];

    // roles
    const isFC = !!(project.roles & ProjectRole.FinancialContact);
    const isMOorPM = !!(project.roles & (ProjectRole.MonitoringOfficer | ProjectRole.ProjectManager));
    const isMO = !!(project.roles & ProjectRole.MonitoringOfficer);

    // add tabs conditionally
    const navigationTabs: TabItem[] = [];

    if (isMOorPM) {
      const allClaimsLink = AllClaimsDashboardRoute.getLink({ projectId });
      navigationTabs.push({ text: "Claims", route: allClaimsLink, selected: allClaimsLink.routeName === currentRoute, qa: "allClaimsTab" });
    }
    else if (isFC) {
      const claimsLink = ClaimsDashboardRoute.getLink({ projectId, partnerId });
      navigationTabs.push({ text: "Claims", route: claimsLink, selected: claimsLink.routeName === currentRoute, qa: "claimsTab" });
    }

    if (isMO) {
      const monitoringReportsLink = MonitoringReportDashboardRoute.getLink({ projectId });
      navigationTabs.push({ text: "Monitoring reports", route: monitoringReportsLink, selected: monitoringReportsLink.routeName === currentRoute, qa: "monitoringReportsTab" });
    }

    if (isMOorPM) {
      const projectForecastsLink = ProjectForecastRoute.getLink({ projectId });
      navigationTabs.push({ text: "Forecasts", route: projectForecastsLink, selected: projectForecastsLink.routeName === currentRoute, qa: "allForecastsTab" });
    }
    else if (isFC) {
      const viewForecastLink = ViewForecastRoute.getLink({ projectId, partnerId });
      navigationTabs.push({ text: "Forecast", route: viewForecastLink, selected: viewForecastLink.routeName === currentRoute, qa: "forecastTab" });
    }

    const projectChangeRequestLink = ProjectChangeRequestsRoute.getLink({ projectId });
    navigationTabs.push({ text: "Project change requests", route: projectChangeRequestLink, selected: projectChangeRequestLink.routeName === currentRoute, qa: "changeRequestsTab" });

    if (isMO) {
      const projectDocumentsLink = ProjectDocumentsRoute.getLink({ projectId });
      navigationTabs.push({ text: "Documents", route: projectDocumentsLink, selected: projectDocumentsLink.routeName === currentRoute, qa: "documentsTab" });
    }

    return (
      <React.Fragment>
        <div className="govuk-grid-row govuk-!-margin-bottom-6" data-qa="projectDetailsLink">
          <div className="govuk-grid-column-full">
            <Link className="govuk-!-font-size-19" route={ProjectDetailsRoute.getLink({ id: projectId })}>Contact details and project summary</Link>
          </div>
        </div>
        <Tabs tabList={navigationTabs} qa="project-navigation" />
      </React.Fragment>
    );
  }
}

export const ProjectNavigation = connect<{}, {}, Props, RootState>(() => ({}), () => ({}))(ProjectNavigationComponent);
