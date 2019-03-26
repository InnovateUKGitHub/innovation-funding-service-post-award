import { QueryBase } from "../common";
import { Authorisation, IContext, ProjectRole } from "../../../types";

export class GetMonitoringReport extends QueryBase<MonitoringReportDto> {
  constructor(
    private readonly monitoringReportHeaderId: string, // TODO don't use this
    private readonly projectId: string,
    private readonly periodId: number,
  ) {
    super();
  }

  protected async accessControl(auth: Authorisation, context: IContext) {
    return auth.for(this.projectId).hasRole(ProjectRole.MonitoringOfficer);
  }

  protected async Run(context: IContext) {
    const header = await context.repositories.monitoringReportHeader.get(this.projectId, this.periodId);
    const results = await context.repositories.monitoringReportResponse.getAllForHeader(this.monitoringReportHeaderId);
    // TODO rename getAll to getAllEnabled ?
    const questions = await context.repositories.questions.getAll(); // TODO rename questions repo to monitoringReportQuestions ?;

    const questionCount = Math.max.apply(Math, questions.map(x => x.Acc_DisplayOrder__c));

    let i;
    const questionArray: QuestionDto[] = [];
    for (i = 0; i < questionCount; i++) {
      questionArray.push(
        {
          title: "",
          score: 0,
          comments: "",
          options: []
        }
      );
    }

    questions.forEach(x => {
      questionArray[x.Acc_DisplayOrder__c - 1].title = x.Acc_QuestionName__c;
      questionArray[x.Acc_DisplayOrder__c - 1].options.push({questionText: x.Acc_QuestionText__c, questionScore: x.Acc_Score__c});
    });

    const monitoringReport: MonitoringReportDto = {
      id: header.Id,
      status: header.Acc_MonitoringReportStatus__c,
      startDate: header.Acc_ProjectStartDate__c,
      endDate: header.Acc_ProjectEndDate__c,
      periodId: header.Acc_ProjectPeriodNumber__c,
      questions: questionArray
    };

    results.forEach(x => {
      monitoringReport.questions.forEach(y => {
        if (y.title === x.Acc_Question__c) {
          y.comments = x.Acc_QuestionComments__c;
          y.score = x.Acc_QuestionScore__c;
        }
      });
    });

    return monitoringReport;
  }
}
