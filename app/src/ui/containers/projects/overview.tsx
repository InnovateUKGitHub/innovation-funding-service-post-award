import React from "react";

import { ContainerBase, ReduxContainer } from "../containerBase";

import { MonitoringReportDashboardRoute } from "../monitoringReports";
import * as ACC from "@ui/components";
import * as Selectors from "@ui/redux/selectors";
import * as Dtos from "@framework/dtos";
import { Pending } from "@shared/pending";
import { IClientUser, ILinkInfo, ProjectRole } from "@framework/types";
import { ProjectDashboardRoute } from "./dashboard";
import { AllClaimsDashboardRoute, ClaimsDashboardRoute, ViewForecastRoute } from "../claims";
import * as Actions from "@ui/redux/actions";
import { ProjectForecastRoute } from "./projectForecasts";
import { ProjectChangeRequestsRoute } from "./projectChangeRequests";
import { ProjectDocumentsRoute } from "./projectDocuments";
import { ProjectDetailsRoute } from "./details";
import { IClientConfig } from "@ui/redux/reducers/configReducer";
import { link } from "fs";
import { NavigationCard } from "@ui/components";

interface Data {
  projectDetails: Pending<Dtos.ProjectDto>;
  partners: Pending<Dtos.PartnerDto[]>;
  contacts: Pending<ProjectContactDto[]>;
  user: IClientUser;
  config: IClientConfig;
}

interface Params {
  id: string;
}

class ProjectOverviewComponent extends ContainerBase<Params, Data, {}> {
  render() {
    const combined = Pending.combine({
      project: this.props.projectDetails,
      partners: this.props.partners,
      contacts: this.props.contacts,
    });

    return <ACC.PageLoader pending={combined} render={x => this.renderContents(x.project, x.partners, x.contacts)} />;
  }

  renderContents(project: Dtos.ProjectDto, partners: Dtos.PartnerDto[], contacts: ProjectContactDto[]) {

    const projectId = project.id;
    // find first partner with role
    const partnerId = partners.filter(x => x.roles !== ProjectRole.Unknown).map(x => x.id)[0];

    return (
      <ACC.Page
        backLink={<ACC.BackLink route={ProjectDashboardRoute.getLink({})}>Back to dashboard</ACC.BackLink>}
        pageTitle={<ACC.Projects.Title project={project} />}
        project={project}
      >
        {this.renderLinks(projectId, partnerId)}
      </ACC.Page>
    );
  }

  private renderLinks(projectId: string, partnerId: string) {
    const links = [
      { text: "Claims", link: AllClaimsDashboardRoute.getLink({ projectId }) },
      { text: "Claims", link: ClaimsDashboardRoute.getLink({ projectId, partnerId }) },
      { text: "Monitoring reports", link: MonitoringReportDashboardRoute.getLink({ projectId }) },
      { text: "Forecasts", link: ProjectForecastRoute.getLink({ projectId }) },
      { text: "Forecast", link: ViewForecastRoute.getLink({ projectId, partnerId }) },
      { text: "Project change requests", link: ProjectChangeRequestsRoute.getLink({ projectId }) },
      { text: "Documents", link: ProjectDocumentsRoute.getLink({ projectId }) },
      { text: "Details", link: ProjectDetailsRoute.getLink({ id: projectId }) },
    ].filter(x => x.link.accessControl(this.props.user, this.props.config));

    return (
      <ACC.NavigationCardsGrid>
        {links.map((x, i) => <NavigationCard label={x.text} route={x.link} key={i} qa={`overview-link-${x.link.routeName}`} />)}
      </ACC.NavigationCardsGrid>
    );
  }
}

const containerDefinition = ReduxContainer.for<Params, Data, {}>(ProjectOverviewComponent);

export const ProjectOverview = containerDefinition.connect({
  withData: (state, props) => ({
    contacts: Selectors.findContactsByProject(props.id).getPending(state),
    partners: Selectors.findPartnersByProject(props.id).getPending(state),
    projectDetails: Selectors.getProject(props.id).getPending(state),
    config: state.config,
    user: state.user
  }),
  withCallbacks: () => ({})
});

export const ProjectOverviewRoute = containerDefinition.route({
  routeName: "projectOverview",
  routePath: "/projects/:id/overview",
  getParams: (r) => ({ id: r.params.id }),
  getLoadDataActions: (params) => [
    Actions.loadProject(params.id),
    Actions.loadContactsForProject(params.id),
    Actions.loadPartnersForProject(params.id),
  ],
  container: ProjectOverview,
  getTitle: () => ({
    htmlTitle: "Project details - project overview",
    displayTitle: "Project overview"
  }),
  accessControl: (auth, { id }) => auth.forProject(id).hasAnyRoles(ProjectRole.FinancialContact, ProjectRole.ProjectManager, ProjectRole.MonitoringOfficer)
});
