import { QueryBase, SALESFORCE_DATE_FORMAT } from "../common";
import { Authorisation, IContext, ProjectRole } from "../../../types";
import { MonitoringReportDto, QuestionDto } from "../../../types/dtos/monitoringReportDto";
import { GetMonitoringReportQuestions } from "./getMonitoringReportQuestions";
import { ISalesforceMonitoringReportResponse } from "../../repositories";

export class GetMonitoringReport extends QueryBase<MonitoringReportDto> {
  constructor(
    private readonly projectId: string,
    private readonly periodId: number,
  ) {
    super();
  }

  protected async accessControl(auth: Authorisation, context: IContext) {
    return auth.for(this.projectId).hasRole(ProjectRole.MonitoringOfficer);
  }

  private createQuestionDto(question: QuestionDto, responses: ISalesforceMonitoringReportResponse[]) {
    const response = responses.find(r => r.Acc_Question__r.Acc_DisplayOrder__c === question.displayOrder);
    return {
      displayOrder: question.displayOrder,
      title: question.title,
      options: question.options,
      optionId: response && response.Acc_Question__c,
      comments: response && response.Acc_QuestionComments__c,
      responseId: response && response.Id
    };
  }

  protected async Run(context: IContext) {
    const header = await context.repositories.monitoringReportHeader.get(this.projectId, this.periodId);
    const results = await context.repositories.monitoringReportResponse.getAllForHeader(header.Id);
    const questionArray = await context.runQuery(new GetMonitoringReportQuestions());

    return {
      headerId: header.Id,
      status: header.Acc_MonitoringReportStatus__c,
      projectId: header.Acc_ProjectId__c,
      startDate: context.clock.parse(header.Acc_ProjectStartDate__c, SALESFORCE_DATE_FORMAT)!,
      endDate: context.clock.parse(header.Acc_ProjectEndDate__c, SALESFORCE_DATE_FORMAT)!,
      periodId: header.Acc_ProjectPeriodNumber__c,
      questions: questionArray.map(q => this.createQuestionDto(q, results))
    };
  }
}
