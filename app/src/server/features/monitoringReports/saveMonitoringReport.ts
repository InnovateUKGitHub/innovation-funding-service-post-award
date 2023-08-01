/* eslint-disable @typescript-eslint/naming-convention */
import { Updatable } from "@server/repositories/salesforceRepositoryBase";
import { GetMonitoringReportActiveQuestions } from "@server/features/monitoringReports/getMonitoringReportActiveQuestions";
import { MonitoringReportDtoValidator } from "@ui/validation/validators/MonitoringReportDtoValidator";
import { ProjectRole } from "@framework/constants/project";
import { MonitoringReportDto } from "@framework/dtos/monitoringReportDto";
import { Authorisation } from "@framework/types/authorisation";
import { IContext } from "@framework/types/IContext";
import { ISalesforceMonitoringReportHeader } from "@server/repositories/monitoringReportHeaderRepository";
import { ISalesforceMonitoringReportResponse } from "@server/repositories/monitoringReportResponseRepository";
import { BadRequestError, ValidationError } from "../common/appError";
import { CommandBase } from "../common/commandBase";
import { GetByIdQuery } from "../projects/getDetailsByIdQuery";
import { noop } from "lodash";

export class SaveMonitoringReport extends CommandBase<boolean> {
  constructor(
    private readonly monitoringReportDto: PickAndPart<MonitoringReportDto, "projectId" | "periodId" | "headerId">,
    private readonly submit: boolean,
  ) {
    super();
  }

  protected async accessControl(auth: Authorisation) {
    return auth.forProject(this.monitoringReportDto.projectId).hasRole(ProjectRole.MonitoringOfficer);
  }

  private async updateHeader(context: IContext) {
    const periodId = this.monitoringReportDto.periodId;

    const profile = await context.repositories.profileTotalPeriod
      .getByProjectIdAndPeriodId(this.monitoringReportDto.projectId, periodId)
      // all the profiles for this period will have the same start and end dates so it doesn't matter which one we use
      .then(profiles => profiles[0]);

    if (!profile) {
      throw new BadRequestError("Invalid profile specified");
    }

    const update: Updatable<ISalesforceMonitoringReportHeader> = {
      Id: this.monitoringReportDto.headerId,
      Acc_ProjectPeriodNumber__c: periodId,
      Acc_PeriodStartDate__c: profile.Acc_ProjectPeriodStartDate__c,
      Acc_PeriodEndDate__c: profile.Acc_ProjectPeriodEndDate__c,
      Acc_AddComments__c: this.monitoringReportDto.addComments,
    };

    if (this.submit) {
      update.Acc_MonitoringReportStatus__c = "Awaiting IUK Approval";
      update.Acc_AddComments__c = "";
    }

    await context.repositories.monitoringReportHeader.update(update);
  }

  private async insertStatusChange(context: IContext): Promise<void> {
    if (!this.submit) return;
    await context.repositories.monitoringReportStatusChange.createStatusChange({
      Acc_MonitoringReport__c: this.monitoringReportDto.headerId,
      Acc_ExternalComment__c: this.monitoringReportDto.addComments,
    });
  }

  private async updateMonitoringReport(context: IContext): Promise<void> {
    const existing =
      (await context.repositories.monitoringReportResponse.getAllForHeader(this.monitoringReportDto.headerId)) || [];

    const updateDtos = this.monitoringReportDto?.questions?.filter(x => x.responseId && x.optionId);
    const insertDtos = this.monitoringReportDto?.questions?.filter(x => !x.responseId && x.optionId);
    const persistedIds = updateDtos?.map(x => x.responseId);
    const deleteItems = existing.filter(x => persistedIds?.indexOf(x.Id) === -1).map(x => x.Id);

    const updateItems = updateDtos?.map<Updatable<ISalesforceMonitoringReportResponse>>(updateDto => ({
      Id: updateDto.responseId ?? "",
      Acc_Question__c: updateDto.optionId ?? "",
      Acc_QuestionComments__c: updateDto.comments,
    }));

    const insertItems = insertDtos?.map<Partial<ISalesforceMonitoringReportResponse>>(insertDto => ({
      Acc_MonitoringHeader__c: this.monitoringReportDto.headerId,
      Acc_Question__c: insertDto.optionId ?? "",
      Acc_QuestionComments__c: insertDto.comments,
    }));

    await Promise.all<AnyObject>([
      updateItems ? context.repositories.monitoringReportResponse.update(updateItems) : noop,
      insertItems ? context.repositories.monitoringReportResponse.insert(insertItems) : noop,
      deleteItems ? context.repositories.monitoringReportResponse.delete(deleteItems) : noop,
    ]);
  }

  protected async run(context: IContext) {
    const header = await context.repositories.monitoringReportHeader.getById(this.monitoringReportDto.headerId);

    if (header.Acc_Project__c !== this.monitoringReportDto.projectId) {
      throw new BadRequestError("Invalid request");
    }

    if (
      header.Acc_MonitoringReportStatus__c !== "Draft" &&
      header.Acc_MonitoringReportStatus__c !== "New" &&
      header.Acc_MonitoringReportStatus__c !== "IUK Queried"
    ) {
      throw new BadRequestError("Report has already been submitted");
    }

    // as we can save a queried by IUK report should this be dependent on the status of the report?
    // discussed with Jamie and it is unlikely -  not something to consider at the moment
    // user can always create a new report to sort this!
    const questions = await context.runQuery(new GetMonitoringReportActiveQuestions());
    const project = await context.runQuery(new GetByIdQuery(this.monitoringReportDto.projectId));

    const validationResult = new MonitoringReportDtoValidator(
      this.monitoringReportDto as MonitoringReportDto,
      true,
      this.submit,
      questions,
      project.periodId,
    );
    if (!validationResult.isValid) {
      throw new ValidationError(validationResult);
    }

    await this.updateMonitoringReport(context);
    await this.updateHeader(context);
    await this.insertStatusChange(context);
    return true;
  }
}
