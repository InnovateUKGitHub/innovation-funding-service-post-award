import { QueryBase } from "../common";
import { IContext } from "../../../types";
import { QuestionDto } from "../../../types/dtos/monitoringReportDto";

export class GetMonitoringReportQuestions extends QueryBase<QuestionDto[]> {

  protected async Run(context: IContext) {
    const questions = await context.repositories.monitoringReportQuestions.getAll();

    const uniqueDisplayOrders = [...new Set(questions.map(x => x.Acc_DisplayOrder__c))];

    return uniqueDisplayOrders.map(x => ({
      title: questions.find(q => q.Acc_DisplayOrder__c === x)!.Acc_QuestionName__c,
      displayOrder: questions.find(q => q.Acc_DisplayOrder__c === x)!.Acc_DisplayOrder__c,
      options: questions.filter(q => q.Acc_DisplayOrder__c === x).map(q => ({
        id: q.Id,
        questionText: q.Acc_QuestionText__c,
        questionScore: q.Acc_Score__c,
      })),
    }));
  }
}
