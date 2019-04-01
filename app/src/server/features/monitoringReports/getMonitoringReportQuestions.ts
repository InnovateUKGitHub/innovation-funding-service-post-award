import { QueryBase } from "../common";
import { IContext } from "../../../types";
import { MonitoringReportDto, OptionDto, QuestionDto } from "../../../types/dtos/monitoringReportDto";
import { ISalesforceQuestions } from "../../repositories";

export class GetMonitoringReportQuestions extends QueryBase<QuestionDto[]> {

  constructor(
    private readonly questionIds?: string[]
  ) {
    super();
  }

  private getAnsweredQuestions(questions: ISalesforceQuestions[]) {
    return questions
      .filter(q => this.questionIds!.indexOf(q.Id) >= 0)
      .map(x => ({
        title: x.Acc_QuestionName__c,
        displayOrder: x.Acc_DisplayOrder__c,
        options: [{
          id: x.Id,
          questionText: x.Acc_QuestionText__c,
          questionScore: x.Acc_Score__c
        }],
      }));
  }

  private getActiveQuestions(allQuestions: ISalesforceQuestions[]) {
    const questions = allQuestions.filter(q => q.Acc_ActiveFlag__c === "Y");
    const uniqueDisplayOrders = [...new Set(questions.map(x => x.Acc_DisplayOrder__c))];
    return uniqueDisplayOrders.map(x => ({
      title: questions.find(q => q.Acc_DisplayOrder__c === x)!.Acc_QuestionName__c,
      displayOrder: questions.find(q => q.Acc_DisplayOrder__c === x)!.Acc_DisplayOrder__c,
      options: questions
        .filter(q => q.Acc_DisplayOrder__c === x)
        .map(q => ({
          id: q.Id,
          questionText: q.Acc_QuestionText__c,
          questionScore: q.Acc_Score__c,
        }))
        // The options should be displayed in descending score order (largest at the top of the list of options)
        .sort((a, b) => b.questionScore - a.questionScore),
    }));
  }

  public async Run(context: IContext) {
    const questions = (await context.repositories.monitoringReportQuestions.getAll())
      .sort((a, b) => a.Acc_DisplayOrder__c - b.Acc_DisplayOrder__c);

    if (this.questionIds) {
      return this.getAnsweredQuestions(questions);
    }
    return this.getActiveQuestions(questions);
  }
}
