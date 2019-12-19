import { IEditorStore } from "@ui/redux";
import * as Dtos from "@framework/dtos";
import { MonitoringReportDtoValidator } from "@ui/validators";
import React, { Component } from "react";
import { TypedForm } from "../form";
import { Section } from "../layout/section";
import { SimpleString } from "../renderers/simpleString";

interface PeriodProps {
  editor: IEditorStore<Dtos.MonitoringReportDto, MonitoringReportDtoValidator>;
  onChange: (dto: Dtos.MonitoringReportDto) => void;
  onSave: (dto: Dtos.MonitoringReportDto, submit: boolean, progress: boolean) => void;
}

export class MonitoringReportPeriodFormComponent extends Component<PeriodProps> {

  public render() {
    const {editor} = this.props;
    const ReportForm = TypedForm<Dtos.MonitoringReportDto>();

    return (
      <Section>
        <ReportForm.Form editor={editor} onChange={(dto) => this.props.onChange(dto)} qa="monitoringReportCreateForm" >
          <ReportForm.Numeric label="Period" labelBold={true} width={3} name="period" value={x => x.periodId} update={(x, v) => x.periodId = v!} validation={editor.validator.periodId} />
          <ReportForm.Fieldset qa="save-buttons">
            <ReportForm.Button name="save-continue" styling="Primary" onClick={() => this.props.onSave(editor.data, false, true)}>Continue to questions</ReportForm.Button>
            <ReportForm.Button name="save-return" onClick={() => this.props.onSave(editor.data, false, false)}>Save and return to project</ReportForm.Button>
          </ReportForm.Fieldset>
        </ReportForm.Form>
      </Section>
    );
  }
}

interface SummaryProps {
  editor: IEditorStore<Dtos.MonitoringReportDto, MonitoringReportDtoValidator>;
  onChange: (dto: Dtos.MonitoringReportDto) => void;
  onSave: (dto: Dtos.MonitoringReportDto, submit: boolean) => void;
}

export class MonitoringReportSummaryFormComponent extends Component<SummaryProps> {

  public render() {
    const {editor} = this.props;
    const ReportForm = TypedForm<Dtos.MonitoringReportDto>();

    return (
      <Section>
        <ReportForm.Form
          editor={editor}
          onChange={(dto) => this.props.onChange(dto)}
          qa="monitoringReportCreateForm"
        >
          <SimpleString>By submitting this report, you certify that from the project monitoring documents shown to you, this report represents your best opinion of the current progress of this project.</SimpleString>
          <ReportForm.Fieldset qa="save-buttons">
            <ReportForm.Button name="save-submitted" styling="Primary" onClick={() => this.props.onSave(editor.data, true)}>Submit report</ReportForm.Button>
            <ReportForm.Button name="save-draft" onClick={() => this.props.onSave(editor.data, false)}>Save and return to project</ReportForm.Button>
          </ReportForm.Fieldset>
        </ReportForm.Form>
      </Section>
    );
  }
}
