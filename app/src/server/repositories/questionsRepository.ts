import SalesforceRepositoryBase from "./salesforceRepositoryBase";

export interface ISalesforceQuestions {
  Id: string;
  Acc_QuestionName__c: string;
  Acc_DisplayOrder__c: number;
  Acc_Score__c: number;
  Acc_QuestionText__c: string;
  Acc_ActiveFlag__c: "Y" | "N";
}

export interface IQuestionsRepository {
  getAll(): Promise<ISalesforceQuestions[]>;
}

export class QuestionsRepository extends SalesforceRepositoryBase<ISalesforceQuestions> implements IQuestionsRepository {
  protected readonly salesforceObjectName = "Acc_Question__c";

  protected readonly salesforceFieldNames = [
    "Id",
    "Acc_QuestionName__c",
    "Acc_DisplayOrder__c",
    "Acc_Score__c",
    "Acc_QuestionText__c",
    "Acc_ActiveFlag__c",
  ];

  private questions = [
    {
      Id: "a",
      Acc_QuestionName__c: "What are your thoughts on elephants?",
      Acc_DisplayOrder__c: 1,
      Acc_Score__c: 1,
      Acc_QuestionText__c: "They are great",
      Acc_ActiveFlag__c: "Y",
    },
    {
      Id: "b",
      Acc_QuestionName__c: "What are your thoughts on elephants?",
      Acc_DisplayOrder__c: 1,
      Acc_Score__c: 2,
      Acc_QuestionText__c: "They are rubbish",
      Acc_ActiveFlag__c: "Y",
    },
    {
      Id: "c",
      Acc_QuestionName__c: "What are your thoughts on cats?",
      Acc_DisplayOrder__c: 2,
      Acc_Score__c: 1,
      Acc_QuestionText__c: "They are brilliant",
      Acc_ActiveFlag__c: "Y",
    },
    {
      Id: "d",
      Acc_QuestionName__c: "What are your thoughts on cats?",
      Acc_DisplayOrder__c: 2,
      Acc_Score__c: 2,
      Acc_QuestionText__c: "They are bad",
      Acc_ActiveFlag__c: "Y",
    }
  ];

  async getAll(): Promise<ISalesforceQuestions[]> {
    return this.questions as ISalesforceQuestions[];
  }
}
