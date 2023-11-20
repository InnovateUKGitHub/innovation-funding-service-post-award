import { ApiName } from "../enum/ApiName";
import { RecordType } from "../enum/RecordType";
import { MonitoringQuestionLookup } from "./MonitoringQuestion.lookup";
import { RecordTypeLookup } from "./RecordType.lookup";
import { Lookup } from "./helper";

interface MonitoringAnswerResponseData {
  RecordTypeId: Lookup<RecordTypeLookup<RecordType.Acc_MonitoringAnswer, ApiName.MonitoringAnswer>>;
  /**
   * @asType integer
   */
  Acc_ProjectPeriodNumber__c: number;
  Acc_Question__c: Lookup<MonitoringQuestionLookup>;
  Acc_QuestionComments__c: string;
}

interface MonitoringAnswerHeaderData {
  RecordTypeId: Lookup<RecordTypeLookup<RecordType.Acc_MonitoringHeader, ApiName.MonitoringAnswer>>;

  /**
   * @asType integer
   */
  Acc_ProjectPeriodNumber__c: number;

  Acc_MonitoringReportStatus__c: "New" | "Draft" | "Awaiting IUK Approval" | "Approved" | "IUK Queried";
}

type MonitoringAnswerData = MonitoringAnswerResponseData | MonitoringAnswerHeaderData;

export { MonitoringAnswerData };
