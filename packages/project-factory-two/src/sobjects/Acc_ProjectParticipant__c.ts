import { AbstractSObject, SObjectField } from "./AbstractProjectFactory";

class Acc_ProjectParticipant__c extends AbstractSObject {
  public readonly sobject = "Acc_ProjectParticipant__c";

  @SObjectField({ nullable: false, readonly: false })
  accessor Acc_AccountId__c: string | undefined;

  @SObjectField({ nullable: false, readonly: false })
  accessor Acc_ProjectId__c: string | undefined;

  @SObjectField({ nullable: false, readonly: false })
  accessor ParticipantMigrationID__c: string | undefined;

  @SObjectField({ nullable: false, readonly: false })
  accessor Acc_ParticipantType__c:
    | "Business"
    | "Knowledge base"
    | "Research"
    | "Research and Technology Organisation (RTO)"
    | "Public sector, charity or non Je-S registered research organisation"
    | undefined;

  @SObjectField({ nullable: false, readonly: false })
  accessor Acc_ParticipantSize__c:
    | "Small"
    | "Medium"
    | "Large"
    | "Academic"
    | "Unknown"
    | "Micro"
    | "Small1"
    | undefined;

  @SObjectField({ nullable: false, readonly: false })
  accessor Acc_ProjectRole__c: "Collaborator" | "Lead" | undefined;

  @SObjectField({ nullable: false, readonly: false })
  accessor Acc_AuditReportFrequency__c:
    | "Never, for this project"
    | "With all claims"
    | "With the first and last claim only"
    | "With the last claim only"
    | "With the first claim, last claim and on every anniversary of the project start date"
    | "Quarterly"
    | undefined;

  @SObjectField({ nullable: false, readonly: false })
  accessor Acc_ParticipantStatus__c:
    | "Pending"
    | "Active"
    | "On Hold"
    | "Invuluntary Withdrawal"
    | "Voluntary Withdrawal"
    | "Migrated - Withdrawn"
    | "Closed"
    | undefined;

  @SObjectField({ nullable: false, readonly: false })
  accessor Acc_Award_Rate__c: number | undefined;

  @SObjectField({ nullable: false, readonly: false })
  accessor Acc_Cap_Limit__c: number | undefined;

  @SObjectField({ nullable: false, readonly: false })
  accessor Acc_FlaggedParticipant__c: boolean | undefined;

  @SObjectField({ nullable: false, readonly: false })
  accessor Acc_OverheadRate__c: number | undefined;

  @SObjectField({ nullable: false, readonly: false })
  accessor Acc_ParticipantProjectReportingType__c: "Public" | "Private" | undefined;

  @SObjectField({ nullable: false, readonly: false })
  accessor Acc_OrganisationType__c: "Industrial" | "Academic" | undefined;

  @SObjectField({ nullable: false, readonly: false })
  accessor Acc_CreateProfiles__c: boolean | undefined;

  @SObjectField({ nullable: false, readonly: false })
  accessor Acc_CreateClaims__c: boolean | undefined;
}

export { Acc_ProjectParticipant__c };
