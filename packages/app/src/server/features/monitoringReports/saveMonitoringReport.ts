import { Updatable } from "@server/repositories/salesforceRepositoryBase";
import { ProjectRolePermissionBits } from "@framework/constants/project";
import { MonitoringReportDto } from "@framework/dtos/monitoringReportDto";
import { Authorisation } from "@framework/types/authorisation";
import { IContext } from "@framework/types/IContext";
import { ISalesforceMonitoringReportHeader } from "@server/repositories/monitoringReportHeaderRepository";
import { ISalesforceMonitoringReportResponse } from "@server/repositories/monitoringReportResponseRepository";
import { BadRequestError } from "../common/appError";
import { ZodAuthorisedAsyncCommandBase } from "../common/commandBase";
import { noop } from "lodash";
import { z } from "zod";
import {
  monitoringReportWorkflowErrorMap,
  MonitoringReportWorkflowSchema,
  monitoringReportWorkflowSchema,
} from "@ui/pages/monitoringReports/workflow/monitoringReportWorkflow.zod";
import {
  monitoringReportSummaryErrorMap,
  MonitoringReportSummarySchema,
  monitoringReportSummarySchema,
} from "@ui/pages/monitoringReports/workflow/monitoringReportSummary.zod";
import {
  createMonitoringReportErrorMap,
  createMonitoringReportSchema,
  MonitoringReportCreateSchema,
} from "@ui/pages/monitoringReports/create/monitoringReportCreate.zod";
import { GetByIdQuery } from "../projects/getDetailsByIdQuery";

type SaveMonitoringReportDto = PickRequiredFromPartial<
  MonitoringReportDto,
  "projectId" | "periodId" | "headerId" | "questions"
>;

export class SaveMonitoringReport extends ZodAuthorisedAsyncCommandBase<
  boolean,
  MonitoringReportWorkflowSchema | MonitoringReportSummarySchema | MonitoringReportCreateSchema,
  SaveMonitoringReportDto
> {
  public readonly runnableName: string = "SaveMonitoringReport";

  protected readonly dto: SaveMonitoringReportDto;
  private readonly submit: boolean;
  private readonly step: number | "prepare-period" | undefined;

  constructor(
    monitoringReportDto: SaveMonitoringReportDto,
    submit: boolean,
    step: number | "prepare-period" | undefined,
  ) {
    super();
    this.dto = monitoringReportDto;
    this.submit = submit;
    this.step = step;
  }

  async accessControl(auth: Authorisation) {
    return auth.forProject(this.dto.projectId).hasRole(ProjectRolePermissionBits.MonitoringOfficer);
  }

  private async updateHeader(context: IContext) {
    // get period id
    const periodId = this.dto.periodId;

    const profile = await context.repositories.profileTotalPeriod
      .getByProjectIdAndPeriodId(this.dto.projectId, periodId)
      // all the profiles for this period will have the same start and end dates so it doesn't matter which one we use
      .then(profiles => profiles[0]);

    if (!profile) {
      throw new BadRequestError("Invalid profile specified");
    }

    const update: Updatable<ISalesforceMonitoringReportHeader> = {
      Id: this.dto.headerId,
      Acc_ProjectPeriodNumber__c: periodId,
      Acc_PeriodStartDate__c: profile.Acc_ProjectPeriodStartDate__c,
      Acc_PeriodEndDate__c: profile.Acc_ProjectPeriodEndDate__c,
      Acc_AddComments__c: this.dto.addComments,
    };

    // add status and comments if is submit action
    if (this.submit) {
      update.Acc_MonitoringReportStatus__c = "Awaiting IUK Approval";
      update.Acc_AddComments__c = "";
    }

    // update header
    await context.repositories.monitoringReportHeader.update(update);
  }

  private async insertStatusChange(context: IContext): Promise<void> {
    // if submitting, then create a status change with header and comments
    if (!this.submit) return;
    await context.repositories.monitoringReportStatusChange.createStatusChange({
      Acc_MonitoringReport__c: this.dto.headerId,
      Acc_ExternalComment__c: this.dto.addComments,
    });
  }

  private async updateMonitoringReport(context: IContext): Promise<void> {
    // get existing monitoring report for the header
    const existing = (await context.repositories.monitoringReportResponse.getAllForHeader(this.dto.headerId)) || [];

    // get updatable items
    const updateDtos = this.dto?.questions?.filter(x => x.responseId && x.optionId);
    // get insertable items
    const insertDtos = this.dto?.questions?.filter(x => !x.responseId && x.optionId);

    // get the ids of the updatable items
    const persistedIds = updateDtos?.map(x => x.responseId);
    // get the ids of the items to be deleted
    const deleteItems = existing.filter(x => persistedIds?.indexOf(x.Id) === -1).map(x => x.Id);

    // convert updatable items for SOQL
    const updateItems = updateDtos?.map<Updatable<ISalesforceMonitoringReportResponse>>(updateDto => ({
      Id: updateDto.responseId ?? "",
      Acc_Question__c: updateDto.optionId ?? "",
      Acc_QuestionComments__c: updateDto.comments,
    }));

    // convert insertable items for SOQL
    const insertItems = insertDtos?.map<Partial<ISalesforceMonitoringReportResponse>>(insertDto => ({
      Acc_MonitoringHeader__c: this.dto.headerId,
      Acc_Question__c: insertDto.optionId ?? "",
      Acc_QuestionComments__c: insertDto.comments,
    }));

    // run the repository updates
    await Promise.all<AnyObject>([
      updateItems ? context.repositories.monitoringReportResponse.update(updateItems) : noop,
      insertItems ? context.repositories.monitoringReportResponse.insert(insertItems) : noop,
      deleteItems ? context.repositories.monitoringReportResponse.delete(deleteItems) : noop,
    ]);
  }

  protected async getZodSchema(context: IContext) {
    if (this.submit) {
      return { schema: monitoringReportSummarySchema, errorMap: monitoringReportSummaryErrorMap };
    } else if (this.step === "prepare-period") {
      const project = await context.runQuery(new GetByIdQuery(this.dto.projectId));

      return { schema: createMonitoringReportSchema(project.periodId), errorMap: createMonitoringReportErrorMap };
    } else {
      return { schema: monitoringReportWorkflowSchema, errorMap: monitoringReportWorkflowErrorMap };
    }
  }

  protected async mapToZod(): Promise<
    | z.input<MonitoringReportWorkflowSchema>
    | z.input<MonitoringReportSummarySchema>
    | z.input<MonitoringReportCreateSchema>
  > {
    if (this.submit) {
      return {
        questions: this.dto.questions.map(x => ({
          optionId: x.optionId ?? "",
          comments: x.comments,
          title: x.title,
        })),
        button_submit: this.submit ? "submit" : "saveAndReturnToSummary",
        addComments: this.dto.addComments ?? "",
        periodId: this.dto.periodId,
      };
    } else if (this.step === "prepare-period") {
      return {
        period: this.dto.periodId,
        button_submit: "saveAndContinue",
      };
    } else {
      return {
        questions: this.dto.questions.map(x => ({
          optionId: x.optionId ?? "",
          comments: x.comments,
          title: x.title,
        })),
        button_submit: this.submit ? "continue" : "saveAndReturnToSummary",
      };
    }
  }

  protected async runRepositoryCommands(context: IContext) {
    // fetch existing header
    const header = await context.repositories.monitoringReportHeader.getById(this.dto.headerId);

    // reject if the header does not match the project id
    if (header.Acc_Project__c !== this.dto.projectId) {
      throw new BadRequestError("Invalid request");
    }

    // check that the status is appropriate for updating the monitoring report?
    if (
      header.Acc_MonitoringReportStatus__c !== "Draft" &&
      header.Acc_MonitoringReportStatus__c !== "New" &&
      header.Acc_MonitoringReportStatus__c !== "IUK Queried"
    ) {
      throw new BadRequestError("Report has already been submitted");
    }

    await this.updateMonitoringReport(context);
    await this.updateHeader(context);
    await this.insertStatusChange(context);
    return true;
  }
}
