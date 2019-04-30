import { MonitoringReportDashboardRoute } from "./dashboard";
import React from "react";
import * as ACC from "../../components/index";
import { Pending } from "../../../shared/pending";
import * as Actions from "../../redux/actions/index";
import * as Selectors from "../../redux/selectors/index";
import * as Dtos from "../../../types/dtos";
import { ContainerBase, ReduxContainer } from "../containerBase";
import { IEditorStore } from "../../redux";
import { MonitoringReportDtoValidator } from "../../validators/MonitoringReportDtoValidator";
export interface MonitoringReportPrepareParams {
  projectId: string;
  id?: string;
}

interface Data {
  project: Pending<Dtos.ProjectDto>;
  editor: Pending<IEditorStore<Dtos.MonitoringReportDto, MonitoringReportDtoValidator>>;
}

interface Callbacks {
  onChange: (projectId: string, id: string, dto: Dtos.MonitoringReportDto, project: Dtos.ProjectDto) => void;
  onSave: (projectId: string, id: string, dto: Dtos.MonitoringReportDto, project: Dtos.ProjectDto, submit: boolean) => void;
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
    const ReportForm = ACC.TypedForm<Dtos.MonitoringReportDto>();
    const formItems = editor.data.questions.map((q, i) => {
      const radioOptions = q.isScored ? (q.options || []).map(y => ({ id: y.id, value: `${y.questionScore} - ${y.questionText}` })) : [];
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
      <ACC.Page
        backLink={<ACC.BackLink route={MonitoringReportDashboardRoute.getLink({ projectId: this.props.projectId })}>Back to monitoring reports</ACC.BackLink>}
        pageTitle={<ACC.Projects.Title pageTitle="Monitoring report" project={project} />}
        validator={editor.validator}
      >
        <ACC.Section>
          <ReportForm.Form data={editor.data} onChange={(dto) => this.props.onChange(dto.projectId, dto.headerId, dto, project)} >
            <ReportForm.String label="Title" labelBold={true} name="title" value={x => x.title} update={(x,v) => x.title = v!} validation={editor.validator.title} />
            <ReportForm.Numeric label="Period" labelBold={true} width="small" name="period" value={x => x.periodId} update={(x, v) => x.periodId = v!} validation={editor.validator.periodId} />
            <ACC.Renderers.SimpleString>For each question score the project against the criteria from 1 to 5, providing a comment explaining your reason. Your Monitoring Portfolio Executive will return the report to you otherwise.</ACC.Renderers.SimpleString>
            {formItems}
            <ACC.Renderers.SimpleString>By submitting this report, you certify that from the project monitoring documents shown to you, this report represents your best opinion of the current progress of this project.</ACC.Renderers.SimpleString>
            <ReportForm.Fieldset qa="save-and-submit">
              <ReportForm.Button name="save-submitted" styling="Primary" onClick={() => this.props.onSave(editor.data.projectId, editor.data.headerId, editor.data, project, true)}>Submit report</ReportForm.Button>
            </ReportForm.Fieldset>
            <ReportForm.Fieldset qa="save-and-return">
              <ReportForm.Button name="save-draft" onClick={() => this.props.onSave(editor.data.projectId, editor.data.headerId, editor.data, project, false)}>Save and return to project</ReportForm.Button>
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
    editor: Selectors.getMonitoringReportEditor(props.projectId, props.id).get(state),
  }),
  withCallbacks: (dispatch) => ({
    onChange: (projectId, id, dto, project) => {
      dispatch(Actions.validateMonitoringReport(projectId, id, dto, dto.questions, project));
    },
    onSave: (projectId, id, dto, project, submit) => {
      dispatch(Actions.saveMonitoringReport(projectId, id, dto, dto.questions, project, submit, () => {
        dispatch(Actions.navigateTo(MonitoringReportDashboardRoute.getLink({ projectId })));
      }));
    }
  })
});

export const MonitoringReportPrepareRoute = containerDefinition.route({
  routeName: "monitoringReportPrepare",
  routePath: "/projects/:projectId/monitoring-reports/:id/prepare",
  getParams: (r) => ({ projectId: r.params.projectId, id: r.params.id }),
  accessControl: (auth, { projectId }, features) => features.monitoringReports && auth.forProject(projectId).hasRole(Dtos.ProjectRole.MonitoringOfficer),
  getLoadDataActions: (params) => [
    Actions.loadProject(params.projectId),
    Actions.loadMonitoringReportQuestions(),
    Actions.loadMonitoringReport(params.projectId, params.id!)
  ],
  container: MonitoringReportPrepare
});

export const MonitoringReportCreateRoute = containerDefinition.route({
  routeName: "monitoringReportCreate",
  routePath: "/projects/:projectId/monitoring-reports/create",
  getParams: (r) => ({ projectId: r.params.projectId }),
  accessControl: (auth, { projectId }, features) => features.monitoringReports && auth.forProject(projectId).hasRole(Dtos.ProjectRole.MonitoringOfficer),
  getLoadDataActions: (params) => [
    Actions.loadProject(params.projectId),
    Actions.loadMonitoringReportQuestions()
  ],
  container: MonitoringReportPrepare
});
