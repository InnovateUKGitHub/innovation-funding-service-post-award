import { BadRequestError, CommandBase, ValidationError } from "../common";
import { Authorisation, ClaimFrequency, IContext, MonitoringReportDto, ProjectRole, } from "@framework/types";
import { ISalesforceMonitoringReportHeader, ISalesforceMonitoringReportResponse } from "@server/repositories";
import { MonitoringReportDtoValidator } from "@framework/ui/validators/MonitoringReportDtoValidator";
import { GetByIdQuery } from "../projects/getDetailsByIdQuery";
import { GetMonitoringReportActiveQuestions } from "./getMonitoringReportActiveQuestions";
import { DateTime } from "luxon";

export class CreateMonitoringReport extends CommandBase<string> {
  constructor(
    private readonly monitoringReportDto: MonitoringReportDto,
    private readonly submit: boolean
  ) {
    super();
  }

  protected async accessControl(auth: Authorisation, context: IContext) {
    return context.config.features.monitoringReports &&
      auth.forProject(this.monitoringReportDto.projectId).hasRole(ProjectRole.MonitoringOfficer);
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
      console.log("VAlidation failed", validationResult);
      throw new ValidationError(validationResult);
    }

    const periodId = this.monitoringReportDto.periodId;
    const periodLength = project.claimFrequency === ClaimFrequency.Quarterly ? 3 : 1;

    const startDate = DateTime.fromJSDate(project.startDate).setZone("Europe/London").plus({months : (periodId - 1) * periodLength });
    const endDate = DateTime.fromJSDate(project.startDate).setZone("Europe/London").plus({months : (periodId) * periodLength, days: -1 });

    const createRequest: Partial<ISalesforceMonitoringReportHeader> = {
      Acc_Project__c: this.monitoringReportDto.projectId,
      Acc_ProjectPeriodNumber__c: periodId,
      Acc_PeriodStartDate__c: startDate.toFormat("yyyy-MM-dd"),
      Acc_PeriodEndDate__c: endDate.toFormat("yyyy-MM-dd"),
      Acc_MonitoringReportStatus__c: "Draft",
      Name: this.monitoringReportDto.title,
    };

    const headerId = await context.repositories.monitoringReportHeader.create(createRequest);

    const insertItems = this.monitoringReportDto.questions.filter(x => x.optionId).map<Partial<ISalesforceMonitoringReportResponse>>(insertDto => ({
      Acc_MonitoringHeader__c: headerId,
      Acc_Question__c: insertDto.optionId!,
      Acc_QuestionComments__c: insertDto.comments
    }));

    await context.repositories.monitoringReportResponse.insert(insertItems);

    if(this.submit) {
      await context.repositories.monitoringReportHeader.update({
        Id: headerId,
        Acc_MonitoringReportStatus__c: "Awaiting IUK Approval"
      });
    }

    return headerId;
  }
}
