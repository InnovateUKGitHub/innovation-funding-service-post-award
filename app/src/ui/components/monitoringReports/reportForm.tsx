import * as ACC from "@ui/components";
import { IEditorStore } from "@ui/redux";
import * as Dtos from "@framework/dtos";
import { MonitoringReportDtoValidator } from "@ui/validators";
import React, { Component } from "react";

interface Props {
  editor: IEditorStore<Dtos.MonitoringReportDto, MonitoringReportDtoValidator>;
  onChange: (dto: Dtos.MonitoringReportDto) => void;
  onSave: (dto: Dtos.MonitoringReportDto, submit: boolean) => void;
}

export class MonitoringReportFormComponent extends Component<Props> {

  public render() {
    const {editor} = this.props;
    const ReportForm = ACC.TypedForm<Dtos.MonitoringReportDto>();

    return (
      <ACC.Section>
        <ReportForm.Form editor={editor} onChange={(dto) => this.props.onChange(dto)} qa="monitoringReportCreateForm" >
          <ReportForm.Numeric label="Period" labelBold={true} width="small" name="period" value={x => x.periodId} update={(x, v) => x.periodId = v!} validation={editor.validator.periodId} />
          <ACC.Renderers.SimpleString>For each question score the project against the criteria from 1 to 5, providing a comment explaining your reason. Your Monitoring Portfolio Executive will return the report to you otherwise.</ACC.Renderers.SimpleString>
          {this.renderFormItems(editor)}
          <ACC.Renderers.SimpleString>By submitting this report, you certify that from the project monitoring documents shown to you, this report represents your best opinion of the current progress of this project.</ACC.Renderers.SimpleString>
          <ReportForm.Fieldset qa="save-and-submit">
            <ReportForm.Button name="save-submitted" styling="Primary" onClick={() => this.props.onSave(editor.data, true)}>Submit report</ReportForm.Button>
          </ReportForm.Fieldset>
          <ReportForm.Fieldset qa="save-and-return">
            <ReportForm.Button name="save-draft" onClick={() => this.props.onSave(editor.data, false)}>Save and return to project</ReportForm.Button>
          </ReportForm.Fieldset>
        </ReportForm.Form>
      </ACC.Section>
    );
  }

  private renderFormItems(editor: IEditorStore<Dtos.MonitoringReportDto, MonitoringReportDtoValidator>) {
    const { data, validator } = editor;
    const ReportForm = ACC.TypedForm<Dtos.MonitoringReportDto>();

    return data.questions.map((q, i) => {
      const radioOptions = q.isScored
        ? (q.options || []).map(y => ({ id: y.id, value: `${y.questionScore} - ${y.questionText}`, qa:`question-${q.displayOrder}-score-${y.questionScore}` }))
        : [];

      return (
        <ReportForm.Fieldset heading={q.title} key={i}>
          <ReportForm.Hidden name={`question_${q.displayOrder}_reponse_id`} value={x => `${i}`} />
          {
            radioOptions.length ? (
              <ReportForm.Radio
                name={`question_${q.displayOrder}_options`}
                label={``}
                inline={false}
                options={radioOptions}
                value={() => radioOptions.find(x => !!q.optionId && x.id === q.optionId)}
                update={(x, value) => x.questions[i].optionId = value && value.id}
                validation={validator.responses.results[i].score}
              />
            ) : (
              <ACC.Renderers.SimpleString className="govuk-hint">{q.description}</ACC.Renderers.SimpleString>
            )
          }
          <ReportForm.MultilineString
            name={`question_${q.displayOrder}_comments`}
            label="Comment"
            value={x => q.comments}
            update={(x, value) => { x.questions[i].comments = value; }}
            validation={validator.responses.results[i].comments}
          />
        </ReportForm.Fieldset>
      );
    });
  }
}
