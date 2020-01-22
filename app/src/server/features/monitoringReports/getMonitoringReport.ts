import { BadRequestError, QueryBase } from "@server/features/common";
import { ISalesforceMonitoringReportHeader, ISalesforceMonitoringReportResponse, ISalesforceMonitoringReportStatus } from "@server/repositories";
import { MonitoringReportDto, MonitoringReportQuestionDto, ProjectRole } from "@framework/dtos";
import { Authorisation, IContext } from "@framework/types";
import { GetMonitoringReportActiveQuestions } from "./getMonitoringReportActiveQuestions";
import { GetMonitoringReportAnsweredQuestions } from "./getMonitoringReportAnsweredQuestions";
import { mapMonitoringReportStatus } from "./mapMonitoringReportStatus";

export class GetMonitoringReportById extends QueryBase<MonitoringReportDto> {
  private readonly updatableStatuses: ISalesforceMonitoringReportStatus[] = ["New", "Draft", "IUK Queried"];

  constructor(private projectId: string, private readonly id: string) {
    super();
  }

  protected async accessControl(auth: Authorisation) {
    return auth.forProject(this.projectId).hasRole(ProjectRole.MonitoringOfficer);
  }

  protected async Run(context: IContext): Promise<MonitoringReportDto> {
    const header = await context.repositories.monitoringReportHeader.getById(this.id);

    if(header.Acc_Project__c !== this.projectId) {
      throw new BadRequestError("Invalid request");
    }

    const results = await context.repositories.monitoringReportResponse.getAllForHeader(header.Id);
    const questionArray = await this.getQuestions(context, header, results);

    const questions = questionArray.map(q => this.populateAnswer(q, results));

    return {
      headerId: header.Id,
      status: mapMonitoringReportStatus(header.Acc_MonitoringReportStatus__c),
      statusName: header.MonitoringReportStatusName,
      projectId: header.Acc_Project__c,
      startDate: context.clock.parseOptionalSalesforceDate(header.Acc_PeriodStartDate__c),
      endDate: context.clock.parseOptionalSalesforceDate(header.Acc_PeriodEndDate__c),
      periodId: header.Acc_ProjectPeriodNumber__c,
      questions,
      lastUpdated: context.clock.parseRequiredSalesforceDateTime(header.LastModifiedDate)
    };
  }

  private async getQuestions(context: IContext, header: ISalesforceMonitoringReportHeader, results: ISalesforceMonitoringReportResponse[]): Promise<MonitoringReportQuestionDto[]> {
    if (this.updatableStatuses.indexOf(header.Acc_MonitoringReportStatus__c) >= 0) {
      return context.runQuery(new GetMonitoringReportActiveQuestions());
    }
    const answeredQuestions = results.map(r => r.Acc_Question__c);
    return context.runQuery(new GetMonitoringReportAnsweredQuestions(answeredQuestions));
  }

  private populateAnswer(question: MonitoringReportQuestionDto, responses: ISalesforceMonitoringReportResponse[]): MonitoringReportQuestionDto {
    const options = question.options.map(o => o.id);

    // if there are no options get it from the preselected answer as its a non-option question
    const response = responses.find(r => options.indexOf(r.Acc_Question__c) >= 0);

    if(!response) {
      return question;
    }

    return Object.assign(question, {
      optionId: response.Acc_Question__c,
      comments: response.Acc_QuestionComments__c,
      responseId: response.Id
    });
  }
}
