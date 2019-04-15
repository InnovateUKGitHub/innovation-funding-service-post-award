import React from "react";
import { ContainerBase, ReduxContainer } from "../containerBase";
import * as ACC from "../../components";
import { Pending } from "@shared/pending";
import * as Actions from "../../redux/actions";
import * as Selectors from "../../redux/selectors";
import { PartnerDto, ProjectDto, ProjectRole } from "../../../types/dtos";
import { ViewForecastRoute } from "../claims";
import { ProjectDashboardRoute } from "@ui/containers";

interface Data {
  projectDetails: Pending<ProjectDto>;
  partners: Pending<PartnerDto[]>;
}

interface Params {
  projectId: string;
}

interface Callbacks {}

class ProjectForecastComponent extends ContainerBase<Params, Data, Callbacks> {
  render() {
    const combined = Pending.combine({projectDetails: this.props.projectDetails, partners: this.props.partners});
    return <ACC.PageLoader pending={combined} render={x => this.renderContents(x.projectDetails, x.partners)} />;
  }

  private renderContents(project: ProjectDto, partners: PartnerDto[]) {
    const Table = ACC.TypedTable<PartnerDto>();

    return (
      <ACC.Page
        tabs={<ACC.Projects.ProjectNavigation project={project} currentRoute={ProjectForecastRoute.routeName} partners={partners}/>}
        backLink={<ACC.BackLink route={ProjectDashboardRoute.getLink({})}>Back to all projects</ACC.BackLink>}
        pageTitle={<ACC.Projects.Title pageTitle="View project" project={project}/>}
      >
        <ACC.Section qa="project-forecasts">
          <Table.Table data={partners} qa="partner-table">
            <Table.String header="Partner" value={x => x.name + (x.isLead ? " (Lead)" : "")} qa="partner" />
            <Table.Currency header="Total eligible costs" value={x => x.totalParticipantGrant} qa="grant-offered" />
            <Table.Currency header="Forecasts and costs" value={x => x.totalFutureForecastsForParticipants} qa="forecasts-and-costs" />
            <Table.Currency header="Underspend" value={x => Math.abs(x.totalParticipantGrant! - x.totalFutureForecastsForParticipants!)} qa="underspend" />
            <Table.ShortDate header="Date of last update" value={x => x.forecastLastModifiedDate} qa="last-updated" />
            <Table.Link header="" value={x => ViewForecastRoute.getLink({ projectId: this.props.projectId, partnerId: x.id })} content="View forecast" qa="view-partner-forecast" />
          </Table.Table>
        </ACC.Section>
      </ACC.Page>
    );
  }
}

const containerDefinition = ReduxContainer.for<Params, Data, Callbacks>(ProjectForecastComponent);

const ProjectForecast = containerDefinition.connect({
  withData: (state, props) => ({
    partners: Selectors.findPartnersByProject(props.projectId).getPending(state),
    projectDetails: Selectors.getProject(props.projectId).getPending(state)
  }),
  withCallbacks: () => ({})
});

export const ProjectForecastRoute = containerDefinition.route({
  routeName: "projectForecasts",
  routePath: "/projects/:projectId/forecasts",
  getParams: (r) => ({ projectId: r.params.projectId }),
  accessControl: (auth, { projectId }) => auth.forProject(projectId).hasAnyRoles(ProjectRole.MonitoringOfficer, ProjectRole.ProjectManager),
  getLoadDataActions: (params) => [
    Actions.loadProject(params.projectId),
    Actions.loadPartnersForProject(params.projectId),
  ],
  container: ProjectForecast
});
