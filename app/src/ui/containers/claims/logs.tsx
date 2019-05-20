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
          {statusChanges.length ? this.renderLogTable(statusChanges) : null}
          {!statusChanges.length ? <ACC.Renderers.SimpleString>There are no changes for this claim.</ACC.Renderers.SimpleString> : null}
        </ACC.Section>
      </ACC.Page>
    );
  }

  private renderLogTable(statusChanges: Dtos.ClaimStatusChangeDto[]) {
    return (
      <div data-qa="claim-status-change-table" style={{ overflowX: "auto" }}>
        <table className={"govuk-table"}>
          <colgroup>
            <col key="0" data-qa="col-created-date" />
            <col key="1" data-qa="col-status-update" />
            <col key="2" data-qa="col-created-by" />
          </colgroup>
          <thead className="govuk-table__head">
            <tr className="govuk-table__row">
              <th className="govuk-table__header" scope="col" key="0">Date and time</th>
              <th className="govuk-table__header" scope="col" key="1">Status update</th>
              <th className="govuk-table__header" scope="col" key="2">Name</th>
            </tr>
          </thead>
          <tbody className="govuk-table__body">
            {statusChanges.map((row, rowIndex) => this.renderLogRow(row, rowIndex))}
          </tbody>
        </table>
      </div>
    );
  }

  private renderLogRow(item: Dtos.ClaimStatusChangeDto, index: number) {
    return (
      <React.Fragment key={index}>
        <tr className="govuk-table__row" key={`${index}_a`}>
          <td className="govuk-table__cell" key="0"><ACC.Renderers.ShortDateTime value={item.createdDate} /></td>
          <td className="govuk-table__cell" key="1">{item.newStatus}</td>
          <td className="govuk-table__cell" key="2">{item.createdBy}</td>
        </tr>
        {item.comments ? <tr className={"govuk-table__row"} key={`${index}_b`}><td className="govuk-table__cell" key="0" colSpan={3}><h5>Comment</h5><span style={{ whiteSpace: "pre-wrap" }}>{item.comments}</span></td></tr> : null}
      </React.Fragment>
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
