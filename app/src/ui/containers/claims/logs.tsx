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
    return (
      <ACC.Page
        backLink={<ACC.BackLink route={AllClaimsDashboardRoute.getLink({ projectId: project.id })}>Back to project</ACC.BackLink>}
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
      <React.Fragment>
        <tr className="govuk-table__row" key={`${index}_a`}>
          <th className="govuk-table__cell" key="0"><ACC.Renderers.ShortDateTime value={item.createdDate} /></th>
          <td className="govuk-table__cell" key="1">{item.newStatus}</td>
          <td className="govuk-table__cell" key="2">{item.createdBy}</td>
        </tr>
        {/* {item.comments ? <tr className={"govuk-table__row"} key={`${index}_b`}><th className="govuk-table__cell" style={{borderBottom: "0px"}} key="0" colSpan={3}>Comments</th></tr> : null} */}
        {item.comments ? <tr className={"govuk-table__row"} key={`${index}_b`}><td className="govuk-table__cell" key="0" colSpan={3}><span style={{whiteSpace:"pre-wrap"}}>{item.comments}</span></td></tr> : null}
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
  accessControl: (auth, params, features) => auth.forProject(params.projectId).hasRole(ProjectRole.MonitoringOfficer)
});
