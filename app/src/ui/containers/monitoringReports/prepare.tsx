import { MonitoringReportDashboardRoute } from "./dashboard";
import React from "react";
import * as ACC from "../../components/index";
import { Pending } from "../../../shared/pending";
import * as Actions from "../../redux/actions/index";
import * as Selectors from "../../redux/selectors/index";
import * as Dtos from "../../../types/dtos";
import { ContainerBase, ReduxContainer } from "../containerBase";
import { ProjectRole } from "../../../types/dtos";
import { IEditorStore } from "../../redux";
import { MonitoringReportDtoValidator } from "../../validators/MonitoringReportDtoValidator";
export interface MonitoringReportPrepareParams {
  projectId: string;
  periodId: number;
}

interface Data {
  project: Pending<Dtos.ProjectDto>;
  editor: Pending<IEditorStore<Dtos.MonitoringReportDto, MonitoringReportDtoValidator>>;
}

interface Callbacks {
  onChange: (projectId: string, periodId: number, dto: Dtos.MonitoringReportDto) => void;
  onSave: (projectId: string, periodId: number, dto: Dtos.MonitoringReportDto, submit: boolean) => void;
}

class PrepareMonitoringReportComponent extends ContainerBase<MonitoringReportPrepareParams, Data, Callbacks> {
  render() {
    const combined = Pending.combine({
      editor: this.props.editor,
      project: this.props.project
    });

    return <ACC.PageLoader pending={combined} render={(data) => this.renderContents(data.project, data.editor)} />;
  }

  private renderContents(project: Dtos.ProjectDto, editor: IEditorStore<Dtos.MonitoringReportDto, MonitoringReportDtoValidator>) {
    const title = <ACC.PeriodTitle periodId={editor.data.periodId} periodStartDate={editor.data.startDate} periodEndDate={editor.data.endDate} />;
    const ReportForm = ACC.TypedForm<Dtos.MonitoringReportDto>();
    const formItems = editor.data.questions.map((q, i) => {
      const radioOptions = (q.options || []).map(y => ({ id: y.id, value: `${y.questionScore} - ${y.questionText}` }));
      const selectedOption = radioOptions.find(x => !!q.optionId && x.id === q.optionId);

      return (
        <ReportForm.Fieldset heading={q.title} key={i}>
          <ReportForm.Hidden name={`question_${q.displayOrder}_reponse_id`} value={x => `${i}`} />
          {radioOptions.length ? <ReportForm.Radio name={`question_${q.displayOrder}_options`} label={``} inline={false} options={radioOptions} value={() => selectedOption} update={(x, value) => x.questions[i].optionId = value && value.id} validation={editor.validator.responses.results[i].score} /> : null}
          <ReportForm.MultilineString name={`question_${q.displayOrder}_comments`} label="Comment" value={x => q.comments} update={(x, value) => { x.questions[i].comments = value; }} validation={editor.validator.responses.results[i].comments} />
        </ReportForm.Fieldset>
      );
    });

    return (
      <ACC.Page>
        <ACC.Section>
          <ACC.BackLink route={MonitoringReportDashboardRoute.getLink({ projectId: this.props.projectId })}>Back to project</ACC.BackLink>
        </ACC.Section>
        <ACC.Projects.Title pageTitle="Monitoring report" project={project} />
        <ACC.ValidationSummary validation={editor.validator} />
        <ACC.Section title={title}>
          <ReportForm.Form data={editor.data} onChange={(dto) => this.props.onChange(this.props.projectId, this.props.periodId, dto)}>
            <ACC.Renderers.SimpleString>For each question score the project against the criteria from 1 to 5, providing a comment explaining your reason. Your Monitoring Portfolio Executive will return the report to you otherwise.</ACC.Renderers.SimpleString>
            {formItems}
            <ACC.Renderers.SimpleString>By submitting this report, you certify that from the project monitoring documents shown to you, this report represents your best opinion of the current progress of this project.</ACC.Renderers.SimpleString>
            <ReportForm.Fieldset qa="save-and-submit">
              <ReportForm.Button name="save-submitted" styling="Primary" onClick={() => this.props.onSave(this.props.projectId, this.props.periodId, editor.data, true)}>Submit report</ReportForm.Button>
            </ReportForm.Fieldset>
            <ReportForm.Fieldset qa="save-and-return">
              <ReportForm.Button name="save-draft" onClick={() => this.props.onSave(this.props.projectId, this.props.periodId, editor.data, false)}>Save and return to project</ReportForm.Button>
            </ReportForm.Fieldset>
          </ReportForm.Form>
        </ACC.Section>
      </ACC.Page>
    );
  }
}

const containerDefinition = ReduxContainer.for<MonitoringReportPrepareParams, Data, Callbacks>(PrepareMonitoringReportComponent);

const MonitoringReportPrepare = containerDefinition.connect({
  withData: (state, props) => ({
    project: Selectors.getProject(props.projectId).getPending(state),
    editor: Selectors.getMonitoringReportEditor(props.projectId, props.periodId).get(state)
  }),
  withCallbacks: (dispatch) => ({
    onChange: (projectId, periodId, dto) => {
      dispatch(Actions.validateMonitoringReport(projectId, periodId, dto, dto.questions));
    },
    onSave: (projectId, periodId, dto, submit) => {
      dispatch(Actions.saveMonitoringReport(projectId, periodId, dto, dto.questions, submit, () => {
        dispatch(Actions.navigateTo(MonitoringReportDashboardRoute.getLink({ projectId })));
      }));
    }
  })
});

export const MonitoringReportPrepareRoute = containerDefinition.route({
  routeName: "monitoringReportPrepare",
  routePath: "/projects/:projectId/monitoring-reports/:periodId/prepare",
  getParams: (r) => ({ projectId: r.params.projectId, periodId: parseInt(r.params.periodId, 10) }),
  accessControl: (auth, { projectId }, features) => features.monitoringReports && auth.forProject(projectId).hasRole(ProjectRole.MonitoringOfficer),
  getLoadDataActions: (params) => [
    Actions.loadProject(params.projectId),
    Actions.loadMonitoringReport(params.projectId, params.periodId)
  ],
  container: MonitoringReportPrepare
});
