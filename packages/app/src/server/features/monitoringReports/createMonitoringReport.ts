import { ProjectRolePermissionBits } from "@framework/constants/project";
import { MonitoringReportDto } from "@framework/dtos/monitoringReportDto";
import { Authorisation } from "@framework/types/authorisation";
import { IContext } from "@framework/types/IContext";
import { ISalesforceMonitoringReportHeader } from "@server/repositories/monitoringReportHeaderRepository";
import { ISalesforceMonitoringReportResponse } from "@server/repositories/monitoringReportResponseRepository";
import { BadRequestError } from "../common/appError";
import { ZodAuthorisedAsyncCommandBase } from "../common/commandBase";
import { GetMonitoringReportActiveQuestions } from "./getMonitoringReportActiveQuestions";
import {
  createMonitoringReportErrorMap,
  createMonitoringReportSchema,
  MonitoringReportCreateSchema,
} from "@ui/pages/monitoringReports/create/monitoringReportCreate.zod";
import { z } from "zod";
import { GetByIdQuery } from "../projects/getDetailsByIdQuery";

type CreateMonitoringReportDto = PickRequiredFromPartial<MonitoringReportDto, "periodId" | "projectId" | "status">;

export class CreateMonitoringReportCommand extends ZodAuthorisedAsyncCommandBase<
  string,
  MonitoringReportCreateSchema,
  CreateMonitoringReportDto
> {
  public readonly runnableName: string = "CreateMonitoringReportCommand";
  protected readonly projectId: ProjectId;
  constructor(
    protected readonly dto: PickRequiredFromPartial<MonitoringReportDto, "periodId" | "projectId" | "status">,
    private readonly submit: boolean,
  ) {
    super();
    this.projectId = dto.projectId;
  }

  async accessControl(auth: Authorisation) {
    return auth.forProject(this.dto.projectId).hasRole(ProjectRolePermissionBits.MonitoringOfficer);
  }

  private async insertStatusChange(context: IContext, headerId: string): Promise<void> {
    await context.repositories.monitoringReportStatusChange.createStatusChange({
      Acc_MonitoringReport__c: headerId,
    });
  }

  protected async getZodSchema(context: IContext) {
    const project = await context.runQuery(new GetByIdQuery(this.dto.projectId));
    const schema = createMonitoringReportSchema(project.periodId);

    return { schema, errorMap: createMonitoringReportErrorMap };
  }

  protected async mapToZod(): Promise<z.input<MonitoringReportCreateSchema>> {
    return {
      period: this.dto.periodId,
      button_submit: "saveAndContinue",
    };
  }

  private async insertMonitoringReportHeader(context: IContext): Promise<string> {
    const periodId = this.dto.periodId;

    const profile = await context.repositories.profileTotalPeriod
      .getByProjectIdAndPeriodId(this.dto.projectId, periodId)
      // all the profiles for this period will have the same start and end dates so it doesn't matter which one we use
      .then(profiles => profiles[0]);

    if (!profile) {
      throw new BadRequestError(`No profiles found for period ${periodId}`);
    }

    const createRequest: Partial<ISalesforceMonitoringReportHeader> = {
      Acc_Project__c: this.dto.projectId,
      Acc_ProjectPeriodNumber__c: periodId,
      Acc_PeriodStartDate__c: profile.Acc_ProjectPeriodStartDate__c,
      Acc_PeriodEndDate__c: profile.Acc_ProjectPeriodEndDate__c,
      Acc_AddComments__c: "",
      Acc_MonitoringReportStatus__c: "Draft",
    };

    return context.repositories.monitoringReportHeader.create(createRequest);
  }

  private async updateMonitoringReportHeader(context: IContext, headerId: string): Promise<void> {
    if (this.submit) {
      // The status is updated after the response has been inserted
      // This is in case the response insert fails:
      // the header is left in draft status, allowing the user to try and re-submit
      await context.repositories.monitoringReportHeader.update({
        Id: headerId,
        Acc_MonitoringReportStatus__c: "Awaiting IUK Approval",
      });
    }
  }

  private async insertResponse(context: IContext, headerId: string): Promise<void> {
    const questions = await context.runQuery(new GetMonitoringReportActiveQuestions());

    const insertItems = questions
      .filter(x => x.optionId)
      .map<Partial<ISalesforceMonitoringReportResponse>>(insertDto => ({
        Acc_MonitoringHeader__c: headerId,
        Acc_Question__c: insertDto.optionId as string,
        Acc_QuestionComments__c: insertDto.comments,
      }));

    await context.repositories.monitoringReportResponse.insert(insertItems);
  }

  protected async runRepositoryCommands(context: IContext) {
    if (this.dto.headerId) {
      throw new BadRequestError("Report has already been created");
    }

    if (this.dto?.questions?.some(x => !!x.responseId)) {
      throw new BadRequestError("Report questions have already been created");
    }

    const headerId = await this.insertMonitoringReportHeader(context);
    await this.insertStatusChange(context, headerId); // Insert status change for Draft
    await this.insertResponse(context, headerId);
    await this.updateMonitoringReportHeader(context, headerId);
    if (this.submit) {
      await this.insertStatusChange(context, headerId); // Insert status change for Awaiting IUK Approval
    }

    return headerId;
  }
}
