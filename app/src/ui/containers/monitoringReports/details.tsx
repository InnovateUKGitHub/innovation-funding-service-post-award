import React from "react";
import { ContainerBase, ReduxContainer } from "../containerBase";
import * as Actions from "../../redux/actions";
import * as Selectors from "../../redux/selectors";
import * as ACC from "../../components";
import * as Dtos from "../../../types";
import { Pending } from "../../../shared/pending";
import { MonitoringReportDashboardRoute } from "./dashboard";
import { ProjectRole } from "../../../types";

interface Params {
  projectId: string;
  periodId: number;
}

interface Data {
  project: Pending<Dtos.ProjectDto>;
  report: Pending<Dtos.MonitoringReportDto>;
}

interface Callbacks {

}

class DetailsComponent extends ContainerBase<Params, Data, Callbacks> {
  render() {
    const combined = Pending.combine({
      report: this.props.report,
      project: this.props.project
    });

    return <ACC.PageLoader pending={combined} render={(data) => this.renderContents(data.project, data.report)} />;
  }

  private renderContents(project: Dtos.ProjectDto, report: Dtos.MonitoringReportDto) {
    const title = <ACC.PeriodTitle periodId={report.periodId} periodStartDate={report.startDate} periodEndDate={report.endDate} />;
    const Details = ACC.TypedDetails<Dtos.MonitoringReportDto>();
    const fields = report.questions.map((q, i) => {
      const response = q.options.find(x => x.id === q.optionId);
      return ([
        <Details.Heading label={report.questions[i].title} key={i} qa={`Question_${i}`} />,
        report.questions[i].options && report.questions[i].options.length ? <Details.String label="Score" value={x => `${(response && response.questionScore) || ""} - ${(response && response.questionText) || ""}`} key={i} qa={`Score_${i}`} /> : null,
        report.questions[i].comments ? <Details.String label="Comments" value={x => report.questions[i].comments} key={i} qa={`Comments_${i}`} /> : null
      ]);
    }).reduce((a, b) => a.concat(b), []).filter(x => !!x);

    return (
      <ACC.Page
        backLink={<ACC.BackLink route={MonitoringReportDashboardRoute.getLink({ projectId: this.props.projectId })}>Back to project</ACC.BackLink>}
        pageTitle={<ACC.Projects.Title pageTitle="Monitoring report" project={project} />}
      >
        <ACC.Section title={title}>
        <Details.Details qa="monitoring-report" data={report} labelWidth="Narrow">
            {fields}
          </Details.Details>
        </ACC.Section>
      </ACC.Page>
    );
  }
}

const containerDefinition = ReduxContainer.for<Params, Data, Callbacks>(DetailsComponent);

export const MonitoringReportView = containerDefinition.connect({
  withData: (state, props) => ({
    project: Selectors.getProject(props.projectId).getPending(state),
    report: Selectors.getMonitoringReport(props.projectId, props.periodId).getPending(state),
  }),
  withCallbacks: () => ({})
});

export const MonitoringReportViewRoute = containerDefinition.route({
  routeName: "monitoringReportView",
  routePath: "/projects/:projectId/monitoring-reports/:periodId",
  getParams: (r) => ({ projectId: r.params.projectId, periodId: parseInt(r.params.periodId, 10) }),
  getLoadDataActions: (params) => [
    Actions.loadProject(params.projectId),
    Actions.loadMonitoringReport(params.projectId, params.periodId),
  ],
  container: MonitoringReportView,
  accessControl: (auth, params, features) => features.monitoringReports && auth.forProject(params.projectId).hasRole(ProjectRole.MonitoringOfficer)
});
