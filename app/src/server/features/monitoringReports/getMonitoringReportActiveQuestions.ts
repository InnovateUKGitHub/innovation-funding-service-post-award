import { QueryBase } from "../common";
import { Authorisation } from "../../../types";
import { IContext } from "../../../types";
import { MonitoringReportQuestionDto } from "../../../types/dtos/monitoringReportDto";
import { ISalesforceMonitoringReportQuestions } from "../../repositories";

export class GetMonitoringReportActiveQuestions extends QueryBase<MonitoringReportQuestionDto[]> {

  protected async accessControl(auth: Authorisation, context: IContext) {
    return context.config.features.monitoringReports;
  }

  private async getQuestions(context: IContext) {
    return (await context.repositories.monitoringReportQuestions.getAll())
      .filter(q => q.Acc_ActiveFlag__c === "Y")
      .sort((a, b) => a.Acc_DisplayOrder__c - b.Acc_DisplayOrder__c)
      .reduce((acc, q) => {
        const options = acc.get(q.Acc_DisplayOrder__c) || [];
        options.push(q);
        acc.set(q.Acc_DisplayOrder__c, options);
        return acc;
      }, new Map<number, ISalesforceMonitoringReportQuestions[]>());
  }

  public async Run(context: IContext) {
    const questions = await this.getQuestions(context);
    return [...questions].map(([displayOrder, options]) => ({
      title: options[0].Acc_QuestionName__c,
      displayOrder,
      optionId: null,
      responseId: null,
      comments: null,
      options: options
        .map(o => ({
          id: o.Id,
          questionText: o.Acc_QuestionText__c,
          questionScore: o.Acc_Score__c,
        }))
        // The options should be displayed in descending score order (largest at the top of the list of options)
        .sort((a, b) => b.questionScore - a.questionScore),
    }));
  }
}
