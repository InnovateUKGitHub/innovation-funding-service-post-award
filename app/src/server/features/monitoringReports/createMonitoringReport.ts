import { ISalesforceMonitoringReportHeader, ISalesforceMonitoringReportResponse } from "@server/repositories";
import { BadRequestError, CommandBase, ValidationError } from "@server/features/common";
import { GetByIdQuery } from "@server/features/projects";
import { GetMonitoringReportActiveQuestions } from "./getMonitoringReportActiveQuestions";
import { MonitoringReportDtoValidator } from "@ui/validators";
import { Authorisation, IContext } from "@framework/types";
import { MonitoringReportDto, ProjectDto, ProjectRole } from "@framework/dtos";

export class CreateMonitoringReportCommand extends CommandBase<string> {
  constructor(
    private readonly monitoringReportDto: MonitoringReportDto,
    private readonly submit: boolean
  ) {
    super();
  }

  protected async accessControl(auth: Authorisation) {
    return auth.forProject(this.monitoringReportDto.projectId).hasRole(ProjectRole.MonitoringOfficer);
  }

  private async insertStatusChange(context: IContext, headerId: string): Promise<void> {
    await context.repositories.monitoringReportStatusChange.createStatusChange({
      Acc_MonitoringReport__c: headerId
    });
  }

  private async insertMonitoringReportHeader(context: IContext, project: ProjectDto): Promise<string> {
    const periodId = this.monitoringReportDto.periodId;

    const profile = await context.repositories.profileTotalPeriod
      .getByProjectIdAndPeriodId(this.monitoringReportDto.projectId, periodId)
      // all the profiles for this period will have the same start and end dates so it doesn't matter which one we use
      .then(profiles => profiles[0]);

    if (!profile) {
      throw new BadRequestError("Invalid profile specified");
    }

    const createRequest: Partial<ISalesforceMonitoringReportHeader> = {
      Acc_Project__c: this.monitoringReportDto.projectId,
      Acc_ProjectPeriodNumber__c: periodId,
      Acc_PeriodStartDate__c: profile.Acc_ProjectPeriodStartDate__c,
      Acc_PeriodEndDate__c: profile.Acc_ProjectPeriodEndDate__c,
      Acc_AddComments__c: "",
      Acc_MonitoringReportStatus__c: "Draft"
    };

    return context.repositories.monitoringReportHeader.create(createRequest);
  }

  private async updateMonitoringReportHeader(context: IContext, headerId: string): Promise<void> {
    if(this.submit) {
      // The status is updated after the response has been inserted
      // This is in case the response insert fails:
      // the header is left in draft status, allowing the user to try and re-submit
      await context.repositories.monitoringReportHeader.update({
        Id: headerId,
        Acc_MonitoringReportStatus__c: "Awaiting IUK Approval"
      });
    }
  }

  private async insertResponse(context: IContext, headerId: string): Promise<void> {
    const insertItems = this.monitoringReportDto.questions.filter(x => x.optionId).map<Partial<ISalesforceMonitoringReportResponse>>(insertDto => ({
      Acc_MonitoringHeader__c: headerId,
      Acc_Question__c: insertDto.optionId!,
      Acc_QuestionComments__c: insertDto.comments
    }));

    await context.repositories.monitoringReportResponse.insert(insertItems);
  }

  protected async Run(context: IContext) {

    if(this.monitoringReportDto.headerId) {
      throw new BadRequestError("Report has already been created");
    }

    if(this.monitoringReportDto.questions.some(x => !!x.responseId)) {
      throw new BadRequestError("Report questions have already been created");
    }

    const project = await context.runQuery(new GetByIdQuery(this.monitoringReportDto.projectId));

    const questions = await context.runQuery(new GetMonitoringReportActiveQuestions());

    const validationResult = new MonitoringReportDtoValidator(this.monitoringReportDto, true, this.submit, questions, project.periodId);
    if (!validationResult.isValid) {
      throw new ValidationError(validationResult);
    }

    const headerId = await this.insertMonitoringReportHeader(context, project);
    await this.insertStatusChange(context, headerId); // Insert status change for Draft
    await this.insertResponse(context, headerId);
    await this.updateMonitoringReportHeader(context, headerId);
    if (this.submit) {
      await this.insertStatusChange(context, headerId); // Insert status change for Awaiting IUK Approval
    }

    return headerId;
  }
}
