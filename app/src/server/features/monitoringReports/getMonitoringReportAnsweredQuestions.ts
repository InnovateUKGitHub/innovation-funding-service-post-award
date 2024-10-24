import { MonitoringReportQuestionDto } from "@framework/dtos/monitoringReportDto";
import { IContext } from "@framework/types/IContext";
import { AuthorisedAsyncQueryBase } from "../common/queryBase";

export class GetMonitoringReportAnsweredQuestions extends AuthorisedAsyncQueryBase<MonitoringReportQuestionDto[]> {
  public readonly runnableName: string = "GetMonitoringReportAnsweredQuestions";
  constructor(private readonly questionIds: string[]) {
    super();
  }

  public async run(context: IContext): Promise<MonitoringReportQuestionDto[]> {
    return (await context.repositories.monitoringReportQuestions.getAll())
      .filter(q => this.questionIds.indexOf(q.Id) >= 0)
      .sort((a, b) => a.Acc_DisplayOrder__c - b.Acc_DisplayOrder__c)
      .map(x => ({
        title: x.Acc_QuestionName__c,
        displayOrder: x.Acc_DisplayOrder__c,
        optionId: null,
        responseId: null,
        comments: null,
        description: x.Acc_QuestionDescription__c,
        isScored: x.Acc_ScoredQuestion__c,
        options: [
          {
            id: x.Id,
            questionText: x.Acc_QuestionText__c,
            questionScore: x.Acc_QuestionScore__c,
          },
        ],
      }));
  }
}
