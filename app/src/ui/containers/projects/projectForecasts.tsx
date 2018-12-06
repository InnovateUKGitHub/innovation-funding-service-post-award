import React from "react";
import { ContainerBase, ReduxContainer } from "../containerBase";
import * as ACC from "../../components";
import { Pending } from "../../../shared/pending";
import * as Actions from "../../redux/actions";
import * as Selectors from "../../redux/selectors";
import { ProjectOverviewPage } from "../../components/projectOverview";
import { ProjectDto } from "../../../types";
import { ViewForecastRoute } from "../claims";

interface Data {
  projectDetails: Pending<ProjectDto>;
  partners: Pending<PartnerDto[]>;
}

interface Params {
  projectId: string;
}

interface Callbacks {}

interface CombinedData {
  projectDetails: ProjectDto;
  partners: PartnerDto[];
}

class ProjectForecastComponent extends ContainerBase<Params, Data, Callbacks> {
  render() {
    const combined = Pending.combine(this.props.projectDetails, this.props.partners, (projectDetails, partners) => ({ projectDetails, partners }));
    const Loader = ACC.TypedLoader<CombinedData>();
    return <Loader pending={combined} render={x => this.renderContents(x.projectDetails, x.partners)} />;
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
            <Table.String header="Date of last update" value={x => "TBC"} qa="last-updated" />
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
  getLoadDataActions: (params) => [
    Actions.loadProject(params.projectId),
    Actions.loadPartnersForProject(params.projectId),
  ],
  container: ProjectForecast
});
