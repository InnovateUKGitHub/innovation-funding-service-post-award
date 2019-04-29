import { QueryBase } from "../common";
import { Authorisation, IContext, ProjectRole } from "../../../types";
import { MonitoringReportDto, MonitoringReportQuestionDto } from "../../../types/dtos/monitoringReportDto";
import { ISalesforceMonitoringReportHeader, ISalesforceMonitoringReportResponse } from "../../repositories";
import { GetMonitoringReportActiveQuestions } from "./getMonitoringReportActiveQuestions";
import { GetMonitoringReportAnsweredQuestions } from "./getMonitoringReportAnsweredQuestions";
import { mapMonitoringReportStatus } from "./mapMonitoringReportStatus";

export class GetMonitoringReport extends QueryBase<MonitoringReportDto> {
  constructor(
    private readonly projectId: string,
    private readonly periodId: number,
  ) {
    super();
  }

  protected async accessControl(auth: Authorisation, context: IContext) {
    return context.config.features.monitoringReports && auth.forProject(this.projectId).hasRole(ProjectRole.MonitoringOfficer);
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

  private async getQuestions(context: IContext, header: ISalesforceMonitoringReportHeader, results: ISalesforceMonitoringReportResponse[]): Promise<MonitoringReportQuestionDto[]> {
    if (header.Acc_MonitoringReportStatus__c === "New" || header.Acc_MonitoringReportStatus__c === "Draft") {
      return context.runQuery(new GetMonitoringReportActiveQuestions());
    }
    const answeredQuestions = results.map(r => r.Acc_Question__c);
    return context.runQuery(new GetMonitoringReportAnsweredQuestions(answeredQuestions));
  }

  protected async Run(context: IContext): Promise<MonitoringReportDto> {
    const header = await context.repositories.monitoringReportHeader.get(this.projectId, this.periodId);
    const results = await context.repositories.monitoringReportResponse.getAllForHeader(header.Id);
    const questionArray = await this.getQuestions(context, header, results);

    const questions = questionArray.map(q => this.populateAnswer(q, results));

    return {
      headerId: header.Id,
      title: header.Name,
      status: mapMonitoringReportStatus(header),
      statusName: header.MonitoringReportStatusName,
      projectId: header.Acc_Project__c,
      startDate: context.clock.parseRequiredSalesforceDate(header.Acc_PeriodStartDate__c),
      endDate: context.clock.parseRequiredSalesforceDate(header.Acc_PeriodEndDate__c),
      periodId: header.Acc_ProjectPeriodNumber__c,
      questions,
      lastUpdated: context.clock.parseRequiredSalesforceDateTime(header.LastModifiedDate)
    };
  }
}
