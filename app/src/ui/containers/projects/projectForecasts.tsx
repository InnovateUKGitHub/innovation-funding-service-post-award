import React from "react";
import { ContainerBase, ReduxContainer } from "../containerBase";
import * as ACC from "../../components";
import { Pending } from "../../../shared/pending";
import * as Actions from "../../redux/actions";
import * as Selectors from "../../redux/selectors";
import { ProjectOverviewPage } from "../../components/projectOverview";
import { IUser, PartnerDto, ProjectDto, ProjectRole } from "../../../types";
import { ViewForecastRoute } from "../claims";

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
    const combined = Pending.combine(this.props.projectDetails, this.props.partners, (projectDetails, partners) => ({ projectDetails, partners }));
    return <ACC.PageLoader pending={combined} render={x => this.renderContents(x.projectDetails, x.partners)} />;
  }

  private renderContents(project: ProjectDto, partners: PartnerDto[]) {
    const Table = ACC.TypedTable<PartnerDto>();

    return (
      <ProjectOverviewPage selectedTab={ProjectForecastRoute.routeName} project={project} partners={partners} backLinkText="Back to dashboard">
        <ACC.Section title="Project forecasts" qa="project-forecasts">
          <Table.Table data={partners} qa="partner-table">
            <Table.String header="Partner" value={x => x.name + (x.isLead ? " (Lead)" : "")} qa="partner" />
            <Table.Currency header="Grant offered" value={x => x.totalParticipantGrant} qa="grant-offered" />
            <Table.Currency header="Forecasts and costs" value={x => x.totalFutureForecastsForParticipants} qa="forecasts-and-costs" />
            <Table.Currency header="Underspend" value={x => Math.abs(x.totalParticipantGrant - x.totalFutureForecastsForParticipants)} qa="underspend" />
            <Table.Custom header="Date of last update" value={x => x.forecastLastModifiedDate ? <ACC.Renderers.FullDateTime value={x.forecastLastModifiedDate}/> : null} qa="last-updated" />
            <Table.Link header="" value={x => ViewForecastRoute.getLink({ projectId: this.props.projectId, partnerId: x.id })} content="View forecast" qa="view-partner-forecast" />
          </Table.Table>
        </ACC.Section>
      </ProjectOverviewPage>
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
  accessControl: (user: IUser, { projectId }) => {
    const userRoles = user.roleInfo[projectId];
    if (!userRoles) return false;
    return !!(userRoles.projectRoles & (ProjectRole.MonitoringOfficer | ProjectRole.ProjectManager));
  },
  getLoadDataActions: (params) => [
    Actions.loadProject(params.projectId),
    Actions.loadPartnersForProject(params.projectId),
  ],
  container: ProjectForecast
});
