import { DateTime } from "luxon";
import {
  Authorisation,
  ClaimFrequency,
  IContext,
  MonitoringReportDto,
  ProjectDto,
  ProjectRole
} from "@framework/types";
import { BadRequestError, CommandBase, ValidationError } from "@server/features/common";
import { ISalesforceMonitoringReportHeader, ISalesforceMonitoringReportResponse } from "@server/repositories";
import { Updatable } from "@server/repositories/salesforceRepositoryBase";
import { GetMonitoringReportActiveQuestions } from "@server/features/monitoringReports/getMonitoringReportActiveQuestions";
import { GetByIdQuery } from "@server/features/projects";
import { MonitoringReportDtoValidator } from "@ui/validators/MonitoringReportDtoValidator";

export class SaveMonitoringReport extends CommandBase<boolean> {
  constructor(
    private readonly monitoringReportDto: MonitoringReportDto,
    private readonly submit: boolean
  ) {
    super();
  }

  protected async accessControl(auth: Authorisation, context: IContext) {
    return context.config.features.monitoringReports && auth.forProject(this.monitoringReportDto.projectId).hasRole(ProjectRole.MonitoringOfficer);
  }

  private async updateHeader(context: IContext, project: ProjectDto) {
    const periodId = this.monitoringReportDto.periodId;
    const periodLength = project.claimFrequency === ClaimFrequency.Quarterly ? 3 : 1;

    const startDate = DateTime.fromJSDate(project.startDate).setZone("Europe/London").plus({ months: (periodId - 1) * periodLength });
    const endDate = DateTime.fromJSDate(project.startDate).setZone("Europe/London").plus({ months: (periodId) * periodLength, days: -1 });

    const update: Updatable<ISalesforceMonitoringReportHeader> = {
      Id: this.monitoringReportDto.headerId,
      Name: this.monitoringReportDto.title,
      Acc_ProjectPeriodNumber__c: periodId,
      Acc_PeriodStartDate__c: startDate.toFormat("yyyy-MM-dd"),
      Acc_PeriodEndDate__c: endDate.toFormat("yyyy-MM-dd")
    };

    if (this.submit) {
      update.Acc_MonitoringReportStatus__c = "Awaiting IUK Approval";
    }

    await context.repositories.monitoringReportHeader.update(update);
  }

  private async insertStatusChange(context: IContext): Promise<void> {
    if (!this.submit) return;
    await context.repositories.monitoringReportStatusChange.createStatusChange({
      Acc_MonitoringReport__c: this.monitoringReportDto.headerId
    });
  }

  private async updateMonitoringReport(context: IContext): Promise<void> {
    const existing = (await context.repositories.monitoringReportResponse.getAllForHeader(this.monitoringReportDto.headerId)) || [];
    const updateDtos = this.monitoringReportDto.questions.filter(x => x.responseId && x.optionId);
    const insertDtos = this.monitoringReportDto.questions.filter(x => !x.responseId && x.optionId);
    const persistedIds = updateDtos.map(x => x.responseId);
    const deleteItems = existing.filter(x => persistedIds.indexOf(x.Id) === -1).map(x => x.Id);

    const updateItems = updateDtos.map<Updatable<ISalesforceMonitoringReportResponse>>(updateDto => ({
      Id: updateDto.responseId!,
      Acc_Question__c: updateDto.optionId!,
      Acc_QuestionComments__c: updateDto.comments
    }));

    const insertItems = insertDtos.map<Partial<ISalesforceMonitoringReportResponse>>(insertDto => ({
      Acc_MonitoringHeader__c: this.monitoringReportDto.headerId,
      Acc_Question__c: insertDto.optionId!,
      Acc_QuestionComments__c: insertDto.comments
    }));

    await Promise.all<{}>([
      context.repositories.monitoringReportResponse.update(updateItems),
      context.repositories.monitoringReportResponse.insert(insertItems),
      context.repositories.monitoringReportResponse.delete(deleteItems),
    ]);
  }

  protected async Run(context: IContext) {
    const header = await context.repositories.monitoringReportHeader.getById(this.monitoringReportDto.headerId);

    if (header.Acc_Project__c !== this.monitoringReportDto.projectId) {
      throw new BadRequestError("Invalid request");
    }

    if (header.Acc_MonitoringReportStatus__c !== "Draft" && header.Acc_MonitoringReportStatus__c !== "New" && header.Acc_MonitoringReportStatus__c !== "IUK Queried") {
      throw new BadRequestError("Report has already been submitted");
    }

    // as we can save a queried by IUK report should this be dependent on the status of the report?
    // discussed with Jamie and so unliklly not something to consider at the moment
    // user can always create a new report to sort this!
    const questions = await context.runQuery(new GetMonitoringReportActiveQuestions());
    const project = await context.runQuery(new GetByIdQuery(this.monitoringReportDto.projectId));

    const validationResult = new MonitoringReportDtoValidator(this.monitoringReportDto, true, this.submit, questions, project.periodId);
    if (!validationResult.isValid) {
      throw new ValidationError(validationResult);
    }

    await this.updateMonitoringReport(context);
    await this.updateHeader(context, project);
    await this.insertStatusChange(context);
    return true;
  }
}
