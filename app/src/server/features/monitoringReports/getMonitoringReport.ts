import { QueryBase, SALESFORCE_DATE_FORMAT } from "../common";
import { Authorisation, IContext, ProjectRole } from "../../../types";
import { MonitoringReportDto, MonitoringReportQuestionDto } from "../../../types/dtos/monitoringReportDto";
import { ISalesforceMonitoringReportHeader, ISalesforceMonitoringReportResponse } from "../../repositories";
import { MonitoringReportStatus } from "../../../types/constants/monitoringReportStatus";
import { GetMonitoringReportActiveQuestions } from "./getMonitoringReportActiveQuestions";
import { GetMonitoringReportAnsweredQuestions } from "./getMonitoringReportAnsweredQuestions";

export class GetMonitoringReport extends QueryBase<MonitoringReportDto> {
  constructor(
    private readonly projectId: string,
    private readonly periodId: number,
  ) {
    super();
  }

  protected async accessControl(auth: Authorisation, context: IContext) {
    return context.config.features.monitoringReports && auth.for(this.projectId).hasRole(ProjectRole.MonitoringOfficer);
  }

  private createQuestionDto(question: MonitoringReportQuestionDto, responses: ISalesforceMonitoringReportResponse[]) {
    const options = question.options.map(o => o.id);
    const response = responses.find(r => options.indexOf(r.Acc_Question__c) >= 0);
    return {
      displayOrder: question.displayOrder,
      title: question.title,
      options: question.options,
      optionId: response && response.Acc_Question__c || null,
      comments: response && response.Acc_QuestionComments__c || null,
      responseId: response && response.Id || null
    };
  }

  private async getQuestions(context: IContext, header: ISalesforceMonitoringReportHeader, results: ISalesforceMonitoringReportResponse[]): Promise<MonitoringReportQuestionDto[]> {
    if (header.Acc_MonitoringReportStatus__c !== MonitoringReportStatus.SUBMITTED) {
      return context.runQuery(new GetMonitoringReportActiveQuestions());
    }
    const answeredQuestions = results.map(r => r.Acc_Question__c);
    return context.runQuery(new GetMonitoringReportAnsweredQuestions(answeredQuestions));
  }

  protected async Run(context: IContext): Promise<MonitoringReportDto> {
    const header = await context.repositories.monitoringReportHeader.get(this.projectId, this.periodId);
    const results = await context.repositories.monitoringReportResponse.getAllForHeader(header.Id);
    const questionArray = await this.getQuestions(context, header, results);

    return {
      headerId: header.Id,
      status: header.Acc_MonitoringReportStatus__c === "Draft" ? MonitoringReportStatus.DRAFT : MonitoringReportStatus.SUBMITTED,
      projectId: header.Acc_ProjectId__c,
      startDate: context.clock.parse(header.Acc_ProjectStartDate__c, SALESFORCE_DATE_FORMAT)!,
      endDate: context.clock.parse(header.Acc_ProjectEndDate__c, SALESFORCE_DATE_FORMAT)!,
      periodId: header.Acc_ProjectPeriodNumber__c,
      questions: questionArray.map(q => this.createQuestionDto(q, results))
    };
  }
}
