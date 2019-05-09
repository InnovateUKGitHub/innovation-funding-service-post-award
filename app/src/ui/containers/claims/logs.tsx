import React from "react";
import { ContainerBase, ReduxContainer } from "../containerBase";
import * as Actions from "../../redux/actions";
import * as Selectors from "../../redux/selectors";
import * as ACC from "../../components";
import * as Dtos from "../../../types";
import { Pending } from "@shared/pending";
import { AllClaimsDashboardRoute } from "@ui/containers";
import { ProjectRole } from "../../../types";

interface Params {
  projectId: string;
  partnerId: string;
  periodId: number;
}

interface Data {
  project: Pending<Dtos.ProjectDto>;
  statusChanges: Pending<Dtos.ClaimStatusChangeDto[]>;
}

interface Callbacks {}

class LogComponent extends ContainerBase<Params, Data, Callbacks> {
  render() {
    const combined = Pending.combine({
      statusChanges: this.props.statusChanges,
      project: this.props.project
    });
    return <ACC.PageLoader pending={combined} render={(data) => this.renderContents(data.project, data.statusChanges)} />;
  }

  private renderLogTable(statusChanges: Dtos.ClaimStatusChangeDto[]) {
    const Table = ACC.TypedTable<Dtos.ClaimStatusChangeDto>();
    return (
      <Table.Table data={statusChanges} qa="claim-status-change-table">
        <Table.ShortDateTime header="Date and time" qa="created-date" value={x => x.createdDate}/>
        <Table.String header="Status update" qa="status-update" value={x => `${x.newStatus}`}/>
        <Table.String header="Name" qa="created-by" value={x => x.createdBy}/>
      </Table.Table>
    );
  }

  private renderContents(project: Dtos.ProjectDto, statusChanges: Dtos.ClaimStatusChangeDto[]) {
    return (
      <ACC.Page
        backLink={<ACC.BackLink route={AllClaimsDashboardRoute.getLink({ projectId: project.id })}>Back to project</ACC.BackLink>}
        pageTitle={<ACC.Projects.Title project={project} />}
        tabs={<ACC.Claims.Navigation project={project} partnerId={this.props.partnerId} periodId={this.props.periodId} currentRouteName={ClaimLogRoute.routeName} />}
      >
        <ACC.Section>
          {this.renderLogTable(statusChanges)}
        </ACC.Section>
      </ACC.Page>
    );
  }
}

const containerDefinition = ReduxContainer.for<Params, Data, Callbacks>(LogComponent);

export const ClaimLog = containerDefinition.connect({
  withData: (state, props) => ({
    project: Selectors.getProject(props.projectId).getPending(state),
    statusChanges: Selectors.getClaimStatusChanges(props.projectId, props.partnerId, props.periodId).getPending(state),
  }),
  withCallbacks: () => ({})
});

export const ClaimLogRoute = containerDefinition.route({
  routeName: "claimLog",
  routePath: "/projects/:projectId/claims/:partnerId/review/:periodId/logs",
  getParams: (r) => ({ projectId: r.params.projectId, partnerId: r.params.partnerId, periodId: parseInt(r.params.partnerId, 10), id: r.params.id }),
  getLoadDataActions: (params) => [
    Actions.loadProject(params.projectId),
    Actions.loadClaimStatusChanges(params.projectId, params.partnerId, params.periodId)
  ],
  container: ClaimLog,
  getTitle: (state, params) => ({
    htmlTitle: "Logs - View claim",
    displayTitle: "Claim"
  }),
  accessControl: (auth, params, features) => auth.forProject(params.projectId).hasRole(ProjectRole.MonitoringOfficer)
});
