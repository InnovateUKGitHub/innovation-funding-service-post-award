import React from "react";
import { BaseProps, ContainerBase, defineRoute } from "../containerBase";
import * as ACC from "../../components";
import * as Dtos from "@framework/types";
import { Pending } from "../../../shared/pending";
import { MonitoringReportQuestionDto, ProjectRole } from "@framework/types";
import { IEditorStore, StoresConsumer } from "@ui/redux";
import { Link, Section, SummaryList, SummaryListItem } from "../../components";
import { MonitoringReportDtoValidator } from "@ui/validators";

interface Params {
  projectId: string;
  id: string;
  mode: "prepare" | "view";
}

interface Data {
  project: Pending<Dtos.ProjectDto>;
  report: Pending<Dtos.MonitoringReportDto>;
  editor: Pending<IEditorStore<Dtos.MonitoringReportDto, MonitoringReportDtoValidator>>;
  statusChanges: Pending<Dtos.MonitoringReportStatusChangeDto[]>;
}

interface Callbacks {
  onChange: (save: boolean, dto: Dtos.MonitoringReportDto, submit?: boolean) => void;
}

class DetailsComponent extends ContainerBase<Params, Data, Callbacks> {
  render() {
    const combined = Pending.combine({
      report: this.props.report,
      project: this.props.project,
      editor: this.props.editor,
    });

    return <ACC.PageLoader pending={combined} render={(data) => this.renderContents(data.project, data.report, data.editor)} />;
  }

  private renderContents(project: Dtos.ProjectDto, report: Dtos.MonitoringReportDto, editor: IEditorStore<Dtos.MonitoringReportDto, MonitoringReportDtoValidator>) {
    const title = <ACC.PeriodTitle periodId={report.periodId} periodStartDate={report.startDate} periodEndDate={report.endDate} />;

    return (
      <ACC.Page
        backLink={<ACC.BackLink route={this.props.routes.monitoringReportDashboard.getLink({ projectId: this.props.projectId })}>Back to monitoring reports</ACC.BackLink>}
        pageTitle={<ACC.Projects.Title project={project} />}
      >
        <ACC.Section title={title} qa="monitoringReportViewSection">
          {report.questions.map((q, i) => this.renderResponse(q, i))}
        </ACC.Section>

        {this.renderLog()}
      </ACC.Page>
    );
  }

  private renderLog() {
    return (
      <Section>
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
        </ACC.Accordion>
      </Section>
    );
  }

  private renderResponse(question: MonitoringReportQuestionDto, index: number) {
    const response = question.options.find(x => x.id === question.optionId);
    const action = this.props.mode === "prepare" && <Link route={this.props.routes.error.getLink({errorType: "notFound"})}>Edit</Link>;
    return (
      <Section title={question.title}>
        <SummaryList qa={`summary-question-${index}`}>
          { question.isScored && <SummaryListItem label="Score" content={(response && `${response.questionScore} - ${response.questionText}`)} qa={`question-${index}-score`} action={action}/> }
          {/*Put the action on the second item if not showing the first*/}
          { <SummaryListItem label="Comments" content={question.comments || ""} qa={`question-${index}-comments`} action={!question.isScored && action}/> }
        </SummaryList>
      </Section>
    );
  }
}

const Container = (props: Params & BaseProps) => (
  <StoresConsumer>
    {
      stores => (
        <DetailsComponent
          project={stores.projects.getById(props.projectId)}
          report={stores.monitoringReports.getById(props.projectId, props.id)}
          statusChanges={stores.monitoringReports.getStatusChanges(props.projectId, props.id)}
          editor={stores.monitoringReports.getUpdateMonitoringReportEditor(props.projectId, props.id)}
          onChange={(save, dto, submit) => {
            stores.monitoringReports.updateMonitoringReportEditor(save, props.projectId, dto, submit, () => {
              stores.navigation.navigateTo(props.routes.monitoringReportDashboard.getLink({ projectId: dto.projectId }));
            });
          }}
          {...props}
        />
      )
    }
  </StoresConsumer>
);

export const MonitoringReportSummaryRoute = defineRoute({
  routeName: "monitoringReportSummary",
  routePath: "/projects/:projectId/monitoring-reports/:id/:mode<(view|prepare){1}>/summary",
  getParams: (r) => ({ projectId: r.params.projectId, id: r.params.id, mode: r.params.mode }),
  container: Container,
  accessControl: (auth, params) => auth.forProject(params.projectId).hasRole(ProjectRole.MonitoringOfficer),
  getTitle: (store, params) => ({
    htmlTitle: params.mode === "view" ? "View monitoring report" : "Edit monitoring report",
    displayTitle: "Monitoring report"
  })
});
