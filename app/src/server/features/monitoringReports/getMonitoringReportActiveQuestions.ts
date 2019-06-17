import { QueryBase } from "../common";
import { ISalesforceMonitoringReportQuestions } from "@server/repositories";
import { IContext } from "@framework/types";
import { MonitoringReportQuestionDto } from "@framework/dtos";

export class GetMonitoringReportActiveQuestions extends QueryBase<MonitoringReportQuestionDto[]> {

  private async getQuestions(context: IContext) {
    const sfQuestions = await context.repositories.monitoringReportQuestions.getAll();
    return sfQuestions
      .filter(q => q.Acc_ActiveFlag__c)
      .sort((a, b) => a.Acc_DisplayOrder__c - b.Acc_DisplayOrder__c)
      .reduce((acc, q) => {
        const options = acc.get(q.Acc_DisplayOrder__c) || [];
        options.push(q);
        acc.set(q.Acc_DisplayOrder__c, options);
        return acc;
      }, new Map<number, ISalesforceMonitoringReportQuestions[]>());
  }

  public async Run(context: IContext): Promise<MonitoringReportQuestionDto[]> {
    const questions = await this.getQuestions(context);
    // if the question is not a scored question the optionId should be prepopulated
    return [...questions].map(([displayOrder, options]) => ({
      title: options[0].Acc_QuestionName__c,
      displayOrder,
      optionId: !options[0].Acc_ScoredQuestion__c ? options[0].Id : null,
      responseId: null,
      comments: null,
      isScored: options[0].Acc_ScoredQuestion__c,
      options: options
        .map(o => ({
          id: o.Id,
          questionText: o.Acc_QuestionText__c,
          questionScore: o.Acc_QuestionScore__c,
        }))
        // The options should be displayed in descending score order (largest at the top of the list of options)
        .sort((a, b) => b.questionScore - a.questionScore),
    }));
  }
}
