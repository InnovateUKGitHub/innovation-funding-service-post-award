import { QueryBase } from "../common";
import { Authorisation, IContext } from "../../../types";
import { QuestionDto } from "../../../types/dtos/monitoringReportDto";

export class GetMonitoringReportAnsweredQuestions extends QueryBase<QuestionDto[]> {

  constructor(
    private readonly questionIds: string[]
  ) {
    super();
  }

  protected async accessControl(auth: Authorisation, context: IContext) {
    return context.config.features.monitoringReports;
  }

  public async Run(context: IContext): Promise<QuestionDto[]> {
    return (await context.repositories.monitoringReportQuestions.getAll())
      .filter(q => this.questionIds.indexOf(q.Id) >= 0)
      .sort((a, b) => a.Acc_DisplayOrder__c - b.Acc_DisplayOrder__c)
      .map(x => ({
        title: x.Acc_QuestionName__c,
        displayOrder: x.Acc_DisplayOrder__c,
        optionId: null,
        responseId: null,
        comments: null,
        options: [{
          id: x.Id,
          questionText: x.Acc_QuestionText__c,
          questionScore: x.Acc_Score__c
        }],
      }));
  }
}
