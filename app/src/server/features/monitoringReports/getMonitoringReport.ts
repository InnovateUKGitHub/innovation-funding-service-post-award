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
    const uniqueDisplayOrders = [...new Set(questions.map(x => x.Acc_DisplayOrder__c))];

    const questionArray: QuestionDto[] = [];
    uniqueDisplayOrders.forEach(x => {
      questionArray.push(
        {
          responseId: "",
          optionId: "",
          title: "",
          comments: "",
          options: [],
          displayOrder: x
        }
      );
    });

    questionArray.forEach(x => {
      questions.forEach(y => {
        if (x.displayOrder === y.Acc_DisplayOrder__c) {
          x.optionId = y.Id;
          x.title = y.Acc_QuestionName__c;
          x.options.push({questionText: y.Acc_QuestionText__c, questionScore: y.Acc_Score__c, id: y.Id});
        }
      });
      results.forEach(r => {
        if (x.optionId === r.Acc_Question__c) {
          x.responseId = r.Id;
        }
      });
    });

    const scoreSorter = (a: OptionDto, b: OptionDto) => b.questionScore.toLocaleString().localeCompare(a.questionScore.toLocaleString());
    const sortOptions = (x: QuestionDto) => {x.options.sort(scoreSorter);};

    questionArray.forEach(x => sortOptions(x));

    const monitoringReport: MonitoringReportDto = {
      headerId: header.Id,
      status: header.Acc_MonitoringReportStatus__c,
      startDate: header.Acc_ProjectStartDate__c,
      endDate: header.Acc_ProjectEndDate__c,
      periodId: header.Acc_ProjectPeriodNumber__c,
      questions: questionArray
    };

    const displayOrderSorter = (a: QuestionDto, b: QuestionDto) => {
      return a.displayOrder > b.displayOrder ? 1 : -1;
    };
    const sortQuestions = (x: MonitoringReportDto) => {x.questions.sort(displayOrderSorter);};

    sortQuestions(monitoringReport);

    monitoringReport.questions.forEach(q => {
      results.forEach(r => {
        if (q.optionId === r.Acc_Question__c) {
          q.comments = r.Acc_QuestionComments__c;
        }
      });
    });

    return monitoringReport;
  }
}
