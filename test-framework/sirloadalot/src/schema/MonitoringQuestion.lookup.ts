interface MonitoringQuestionPointsLookup {
  type: "Acc_MonitoringQuestion__c";
  Acc_QuestionScore__c: 1 | 2 | 3 | 4 | 5;
  Acc_QuestionName__c:
    | "Scope"
    | "Time"
    | "Cost"
    | "Exploitation"
    | "Risk management"
    | "Project planning";
}

interface MonitoringReportTextLookup {
  type: "Acc_MonitoringQuestion__c";
  Acc_QuestionName__c: "Summary" | "Issues and actions";
}

type MonitoringQuestionLookup =
  | MonitoringQuestionPointsLookup
  | MonitoringReportTextLookup;

export { MonitoringQuestionLookup };
