import SalesforceRepositoryBase from "./salesforceRepositoryBase";

export interface ISalesforceMonitoringReportQuestions {
  Id: string;
  Acc_QuestionName__c: string;
  Acc_DisplayOrder__c: number;
  Acc_QuestionScore__c: number;
  Acc_QuestionText__c: string;
  Acc_ActiveFlag__c: boolean;
  Acc_ScoredQuestion__c: boolean;
}

export interface IMonitoringReportQuestionsRepository {
  getAll(): Promise<ISalesforceMonitoringReportQuestions[]>;
}

export class MonitoringReportQuestionsRepository extends SalesforceRepositoryBase<ISalesforceMonitoringReportQuestions> implements IMonitoringReportQuestionsRepository {
  protected readonly salesforceObjectName = "Acc_MonitoringQuestion__c";

  protected readonly salesforceFieldNames = [
    "Id",
    "Acc_QuestionName__c",
    "Acc_DisplayOrder__c",
    "Acc_QuestionScore__c",
    "Acc_QuestionText__c",
    "Acc_ActiveFlag__c",
    "Acc_ScoredQuestion__c"
  ];

  public async getAll(): Promise<ISalesforceMonitoringReportQuestions[]> {
    return await super.all();
  }
}
