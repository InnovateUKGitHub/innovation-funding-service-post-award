enum ApiName {
  Competition = "Competition__c",
  Account = "Account",
  Contact = "Contact",
  ProjectParticipant = "Acc_ProjectParticipant__c",
  Project = "Acc_Project__c",
  ProjectContactLink = "Acc_ProjectContactLink__c",
  User = "User",
  CostCategory = "Acc_CostCategory__c",
  Profile = "Acc_Profile__c",
  Claim = "Acc_Claims__c",
  ProjectChangeRequest = "Acc_ProjectChangeRequest__c",
  MonitoringAnswer = "Acc_MonitoringAnswer__c",
  MonitoringQuestion = "Acc_MonitoringQuestion__c",
  RecordType = "RecordType",
}

const bulkLoadableApiName = [
  ApiName.Competition,
  ApiName.Account,
  ApiName.Contact,
  ApiName.ProjectParticipant,
  ApiName.Project,
  ApiName.ProjectContactLink,
  ApiName.User,
  ApiName.Profile,
  ApiName.Claim,
  ApiName.ProjectChangeRequest,
  ApiName.MonitoringAnswer,
] as const;

type BulkLoadableApiName = (typeof bulkLoadableApiName)[number];

export { ApiName, bulkLoadableApiName };
export type { BulkLoadableApiName };
