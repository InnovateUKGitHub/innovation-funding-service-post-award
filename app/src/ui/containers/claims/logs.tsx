import React from "react";
import * as ACC from "@ui/components";
import * as Actions from "@ui/redux/actions";
import * as Selectors from "@ui/redux/selectors";
import * as Dtos from "@framework/types";
import { Pending } from "@shared/pending";
import { AllClaimsDashboardRoute, ClaimsDashboardRoute } from "@ui/containers";
import { ProjectRole } from "@framework/types";
import { ContainerBase, ReduxContainer } from "../containerBase";

interface Params {
  projectId: string;
  partnerId: string;
  periodId: number;
  action: "review" | "prepare" | "details";
}

interface Data {
  project: Pending<Dtos.ProjectDto>;
  statusChanges: Pending<Dtos.ClaimStatusChangeDto[]>;
}

interface Callbacks { }

class LogComponent extends ContainerBase<Params, Data, Callbacks> {
  render() {
    const combined = Pending.combine({
      statusChanges: this.props.statusChanges,
      project: this.props.project
    });
    return <ACC.PageLoader pending={combined} render={(data) => this.renderContents(data.project, data.statusChanges)} />;
  }

  private renderContents(project: Dtos.ProjectDto, statusChanges: Dtos.ClaimStatusChangeDto[]) {
    const backRoute = project.roles === ProjectRole.FinancialContact
      ? ClaimsDashboardRoute.getLink({ projectId: this.props.projectId, partnerId: this.props.partnerId })
      : AllClaimsDashboardRoute.getLink({ projectId: project.id });

    return (
      <ACC.Page
        backLink={<ACC.BackLink route={backRoute}>Back to project</ACC.BackLink>}
        pageTitle={<ACC.Projects.Title project={project} />}
        tabs={<ACC.Claims.Navigation project={project} partnerId={this.props.partnerId} periodId={this.props.periodId} />}
      >
        <ACC.Section>
          {statusChanges.length ? <ACC.Logs qa="claim-status-change-table" data={statusChanges}/> : null}
          {!statusChanges.length ? <ACC.Renderers.SimpleString>There are no changes for this claim.</ACC.Renderers.SimpleString> : null}
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
  routePath: "/projects/:projectId/claims/:partnerId/:action/:periodId/logs",
  getParams: (r) => ({ projectId: r.params.projectId, partnerId: r.params.partnerId, periodId: parseInt(r.params.periodId, 10), id: r.params.id, action: r.params.action }),
  getLoadDataActions: (params) => [
    Actions.loadProject(params.projectId),
    Actions.loadClaimStatusChanges(params.projectId, params.partnerId, params.periodId)
  ],
  container: ClaimLog,
  getTitle: (state, params) => ({
    htmlTitle: "Logs - View claim",
    displayTitle: "Claim"
  }),
  accessControl: (auth, params, features) =>
    auth.forProject(params.projectId).hasAnyRoles(ProjectRole.MonitoringOfficer, ProjectRole.ProjectManager) ||
    auth.forPartner(params.projectId, params.partnerId).hasAnyRoles(ProjectRole.FinancialContact)
});
