import React from "react";
import { BaseProps, ContainerBase, defineRoute } from "../containerBase";
import * as ACC from "../../components";
import * as Dtos from "@framework/types";
import { Pending } from "../../../shared/pending";
import { MonitoringReportQuestionDto, ProjectRole } from "@framework/types";
import { StoresConsumer } from "@ui/redux";

interface Params {
  projectId: string;
  id: string;
}

interface Data {
  project: Pending<Dtos.ProjectDto>;
  report: Pending<Dtos.MonitoringReportDto>;
  statusChanges: Pending<Dtos.MonitoringReportStatusChangeDto[]>;
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

    return (
      <ACC.Page
        backLink={<ACC.BackLink route={this.props.routes.monitoringReportDashboard.getLink({ projectId: this.props.projectId })}>Back to monitoring reports</ACC.BackLink>}
        pageTitle={<ACC.Projects.Title project={project} />}
      >
        <ACC.Section title={title} qa="monitoringReportViewSection">
          {report.questions
            .map((q, i) => this.renderResponse(q, i))
            .reduce((a, b) => a.concat(b), [])
            .filter(x => !!x)}
        </ACC.Section>

        {this.renderLog()}
      </ACC.Page>
    );
  }

  private renderLog() {
    return (
      <ACC.Accordion>
        <ACC.AccordionItem title="Status and comments log" qa="status-and-comments-log">
          {/* Keeping logs inside loader because accordion defaults to closed*/}
          <ACC.Loader
            pending={this.props.statusChanges}
            render={(statusChanges) => (
              <ACC.Logs data={statusChanges} qa="monitoring-report-status-change-table" />
            )}
          />
        </ACC.AccordionItem>
      </ACC.Accordion>);
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

const DetailsContainer = (props: Params & BaseProps) => (
  <StoresConsumer>
    {
      stores => (
        <DetailsComponent
          project={stores.projects.getById(props.projectId)}
          report={stores.monitoringReports.getById(props.projectId, props.id)}
          statusChanges={stores.monitoringReports.getStatusChanges(props.projectId, props.id)}
          {...props}
        />
      )
    }
  </StoresConsumer>
);

export const MonitoringReportViewRoute = defineRoute({
  routeName: "monitoringReportView",
  routePath: "/projects/:projectId/monitoring-reports/:id/details",
  getParams: (r) => ({ projectId: r.params.projectId, id: r.params.id }),
  container: DetailsContainer,
  accessControl: (auth, params) => auth.forProject(params.projectId).hasRole(ProjectRole.MonitoringOfficer),
  getTitle: () => ({
    htmlTitle: "View monitoring report",
    displayTitle: "Monitoring report"
  })
});
