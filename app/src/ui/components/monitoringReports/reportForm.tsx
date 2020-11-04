import { IEditorStore } from "@ui/redux";
import * as Dtos from "@framework/dtos";
import { MonitoringReportDtoValidator } from "@ui/validators";
import React, { Component } from "react";
import { TypedForm } from "../form";
import { Section } from "../layout/section";
import { SimpleString } from "@ui/components/renderers";
import { Content } from "../content";

interface PeriodProps {
  editor: IEditorStore<Dtos.MonitoringReportDto, MonitoringReportDtoValidator>;
  onChange: (dto: Dtos.MonitoringReportDto) => void;
  onSave: (dto: Dtos.MonitoringReportDto, submit: boolean, progress: boolean) => void;
}

export class MonitoringReportPeriodFormComponent extends Component<PeriodProps> {
  public render() {
    const { editor } = this.props;
    const ReportForm = TypedForm<Dtos.MonitoringReportDto>();

    return (
      <React.Fragment>
        <Section>
          <SimpleString><Content value={(x) => x.components.reportForm.reportMessage} /></SimpleString>
          <SimpleString><Content value={(x) => x.components.reportForm.questionScoreMessage} /></SimpleString>
        </Section>
        <Section>
          <ReportForm.Form editor={editor} onChange={(dto) => this.props.onChange(dto)} qa="monitoringReportCreateForm">
            <ReportForm.Numeric
              label="Period"
              labelBold={true}
              width={3}
              name="period"
              value={(x) => x.periodId}
              update={(x, v) => (x.periodId = v!)}
              validation={editor.validator.periodId}
            />
            <ReportForm.Fieldset qa="save-buttons">
              <ReportForm.Button
                name="save-continue"
                styling="Primary"
                onClick={() => this.props.onSave(editor.data, false, true)}
              >
                <Content value={(x) => x.components.reportForm.continueText} />
              </ReportForm.Button>
              <ReportForm.Button name="save-return" onClick={() => this.props.onSave(editor.data, false, false)}>
                <Content value={(x) => x.components.reportForm.saveAndReturnText} />
              </ReportForm.Button>
            </ReportForm.Fieldset>
          </ReportForm.Form>
        </Section>
      </React.Fragment>
    );
  }
}
