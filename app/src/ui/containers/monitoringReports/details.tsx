import React from "react";
import { ContainerBase, ReduxContainer } from "../containerBase";
import * as Actions from "../../redux/actions";
import * as Selectors from "../../redux/selectors";
import * as ACC from "../../components";
import * as Dtos from "@framework/types";
import { Pending } from "../../../shared/pending";
import { MonitoringReportDashboardRoute } from "./dashboard";
import { MonitoringReportQuestionDto, ProjectRole } from "@framework/types";

interface Params {
  projectId: string;
  id: string;
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
    const title = `Period ${report.periodId}: ${report.title}`;

    return (
      <ACC.Page
        backLink={<ACC.BackLink route={MonitoringReportDashboardRoute.getLink({ projectId: this.props.projectId })}>Back to monitoring reports</ACC.BackLink>}
        pageTitle={<ACC.Projects.Title project={project} />}
        tabs={<ACC.MonitoringReports.Navigation projectId={this.props.projectId} id={this.props.id} />}
      >
        <ACC.Section title={title}>
          {this.renderResponses(report)}
        </ACC.Section>
      </ACC.Page>
    );
  }

  private renderResponses(report: Dtos.MonitoringReportDto) {
    return report.questions
      .map((q, i) => this.renderResponse(q, i))
      .reduce((a, b) => a.concat(b), [])
      .filter(x => !!x);
  }

  private renderResponse(question: MonitoringReportQuestionDto, index: number) {
    const response = question.options.find(x => x.id === question.optionId);
    return [
      this.renderQuestionTitle(question, index),
      question.isScored ? this.renderQuestionResponse("Score", `${(response && response.questionScore) || ""} - ${(response && response.questionText) || ""}`, index) : null,
      question.comments ? this.renderQuestionResponse("Comments", question.comments, index) : null,
    ];
  }

  private renderQuestionTitle = (question: MonitoringReportQuestionDto, index: number) => {
    return (
      <div data-qa={`monitoring-report-Question_${index}`} className="govuk-grid-row govuk-!-margin-top-4" key={index}>
        <div className={"govuk-grid-column-full"} data-qa={`Question_${index}`}>
          <h4 className="govuk-heading-s">{question.title}</h4>
        </div>
      </div>
    );
  }

  private renderQuestionResponse = (responseType: "Score" | "Comments", responseText: string | null, index: number) => {
    return (
      <div data-qa={`monitoring-report-${responseType}_${index}`} className="govuk-grid-row govuk-!-margin-top-1">
        <div className="govuk-grid-column-one-quarter">
          <ACC.Renderers.SimpleString>{responseType}</ACC.Renderers.SimpleString>
        </div>
        <div className="govuk-grid-column-three-quarters">
          <ACC.Renderers.SimpleString>{responseText}</ACC.Renderers.SimpleString>
        </div>
      </div>
    );
  }
}

const containerDefinition = ReduxContainer.for<Params, Data, Callbacks>(DetailsComponent);

export const MonitoringReportView = containerDefinition.connect({
  withData: (state, props) => ({
    project: Selectors.getProject(props.projectId).getPending(state),
    report: Selectors.getMonitoringReport(props.projectId, props.id).getPending(state),
  }),
  withCallbacks: () => ({})
});

export const MonitoringReportViewRoute = containerDefinition.route({
  routeName: "monitoringReportView",
  routePath: "/projects/:projectId/monitoring-reports/:id/details",
  getParams: (r) => ({ projectId: r.params.projectId, id: r.params.id }),
  getLoadDataActions: (params) => [
    Actions.loadProject(params.projectId),
    Actions.loadMonitoringReport(params.projectId, params.id),
  ],
  container: MonitoringReportView,
  accessControl: (auth, params, features) => features.monitoringReports && auth.forProject(params.projectId).hasRole(ProjectRole.MonitoringOfficer),
  getTitle: (state, params) => ({
    htmlTitle: "View monitoring report",
    displayTitle: "Monitoring report"
  })
});
