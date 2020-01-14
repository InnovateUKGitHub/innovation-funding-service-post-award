import SalesforceRepositoryBase from "./salesforceRepositoryBase";

export interface ISalesforceMonitoringReportQuestions {
  Id: string;
  Acc_QuestionName__c: string;
  Acc_DisplayOrder__c: number;
  Acc_QuestionScore__c: number;
  Acc_QuestionText__c: string;
  Acc_QuestionDescription__c: string;
  Acc_ActiveFlag__c: boolean;
  Acc_ScoredQuestion__c: boolean;
}

export interface IMonitoringReportQuestionsRepository {
  getAll(): Promise<ISalesforceMonitoringReportQuestions[]>;
}

/**
 * The questions for a monitoring report
 * 
 * Stored in Acc_MonitoringQuestion__c table
 * 
 * Questions can be enabled or disabled for new reports
 */
export class MonitoringReportQuestionsRepository
  extends SalesforceRepositoryBase<ISalesforceMonitoringReportQuestions>
  implements IMonitoringReportQuestionsRepository {
  protected readonly salesforceObjectName = "Acc_MonitoringQuestion__c";

  protected readonly salesforceFieldNames = [
    "Id",
    "Acc_QuestionName__c",
    "Acc_DisplayOrder__c",
    "Acc_QuestionScore__c",
    "Acc_QuestionText__c",
    "Acc_QuestionDescription__c",
    "Acc_ActiveFlag__c",
    "Acc_ScoredQuestion__c"
  ];

  public getAll(): Promise<ISalesforceMonitoringReportQuestions[]> {
    return super.all();
  }
}
