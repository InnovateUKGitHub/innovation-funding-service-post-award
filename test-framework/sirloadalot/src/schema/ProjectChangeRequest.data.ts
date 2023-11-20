import { ApiName } from "../enum/ApiName";
import { RecordType } from "../enum/RecordType";
import { RecordTypeLookup } from "./RecordType.lookup";
import { Lookup } from "./helper";

interface ProjectChangeRequestHeaderData {
  Acc_Status__c:
    | "Draft"
    | "Submitted to Monitoring Officer"
    | "Queried by Monitoring Officer"
    | "Submitted to Innovate UK"
    | "Queried by Innovate UK"
    | "Submitted to Innovation Lead"
    | "Queried by Innovation Lead"
    | "In External Review"
    | "In Review with Innovate UK"
    | "In Review with Project Finance"
    | "Withdrawn"
    | "Ready for approval"
    | "Rejected"
    | "Approved"
    | "Actioned";
  RecordTypeId: Lookup<RecordTypeLookup<RecordType.Acc_RequestHeader, ApiName.ProjectChangeRequest>>;
}

interface ProjectChangeRequestChildData {
  RecordTypeId: Lookup<
    | RecordTypeLookup<RecordType.Loan_LoanDrawdownChange, ApiName.ProjectChangeRequest>
    | RecordTypeLookup<RecordType.Loan_ParticipantVirementForLoanDrawdown, ApiName.ProjectChangeRequest>
    | RecordTypeLookup<RecordType.Loan_PeriodVirementForLoanDrawdown, ApiName.ProjectChangeRequest>
    | RecordTypeLookup<RecordType.Loan_ChangeLoansDuration, ApiName.ProjectChangeRequest>
    | RecordTypeLookup<RecordType.Acc_AccountNameChange, ApiName.ProjectChangeRequest>
    | RecordTypeLookup<RecordType.Acc_MultiplePartnerFinancialVirement, ApiName.ProjectChangeRequest>
    | RecordTypeLookup<RecordType.Acc_PartnerAddition, ApiName.ProjectChangeRequest>
    | RecordTypeLookup<RecordType.Acc_PartnerWithdrawal, ApiName.ProjectChangeRequest>
    | RecordTypeLookup<RecordType.Acc_ProjectSuspension, ApiName.ProjectChangeRequest>
    | RecordTypeLookup<RecordType.Acc_ProjectTermination, ApiName.ProjectChangeRequest>
    | RecordTypeLookup<RecordType.Acc_SinglePartnerFinancialVirement, ApiName.ProjectChangeRequest>
    | RecordTypeLookup<RecordType.Acc_TimeExtension, ApiName.ProjectChangeRequest>
    | RecordTypeLookup<RecordType.Acc_AddAPartner, ApiName.ProjectChangeRequest>
    | RecordTypeLookup<RecordType.Acc_BetweenPartnerFinancialVirement, ApiName.ProjectChangeRequest>
    | RecordTypeLookup<RecordType.Acc_ChangeAPartnersName, ApiName.ProjectChangeRequest>
    | RecordTypeLookup<RecordType.Acc_ChangeProjectDuration, ApiName.ProjectChangeRequest>
    | RecordTypeLookup<RecordType.Acc_ChangeProjectScope, ApiName.ProjectChangeRequest>
    | RecordTypeLookup<RecordType.Acc_EndTheProjectEarly, ApiName.ProjectChangeRequest>
    | RecordTypeLookup<RecordType.Acc_FinancialVirement, ApiName.ProjectChangeRequest>
    | RecordTypeLookup<RecordType.Acc_PutProjectOnHold, ApiName.ProjectChangeRequest>
    | RecordTypeLookup<RecordType.Acc_ReallocateOnePartnersProjectCosts, ApiName.ProjectChangeRequest>
    | RecordTypeLookup<RecordType.Acc_ReallocateSeveralPartnersProjectCost, ApiName.ProjectChangeRequest>
    | RecordTypeLookup<RecordType.Acc_RemoveAPartner, ApiName.ProjectChangeRequest>
    | RecordTypeLookup<RecordType.Acc_ProjectChangeRequests, ApiName.ProjectChangeRequest>
    | RecordTypeLookup<RecordType.Acc_ChangePeriodLength, ApiName.ProjectChangeRequest>
  >;
  Acc_Reasoning__c?: string;
  Acc_MarkedasComplete__c?: "To Do" | "Incomplete" | "Complete";
  Acc_NewOrganisationName__c?: string;
  Acc_NewProjectSummary__c?: string;
  Acc_NewPublicDescription__c?: string;
  Acc_Comments__c?: string;
  Acc_AdditionalNumberofMonths__c?: number;
  Acc_NewProjectDuration__c?: number;
  Acc_RemovalPeriod__c?: number;
  Acc_ExistingProjectDuration__c?: number;
  Acc_SuspensionStarts__c?: string;
  Acc_SuspensionEnds__c?: string;
  Acc_PublicDescriptionSnapshot__c?: string;
  Acc_ProjectSummarySnapshot__c?: string;
  Acc_ExistingPartnerName__c?: string;
  Acc_Nickname__c?: string;
  Acc_ProjectRole__c?: string;
  ProjectRoleLabel?: string;
  Acc_ParticipantType__c?: string;
  ParticipantTypeLabel?: string;
  Acc_OrganisationName__c?: string;
  Acc_RegisteredAddress__c?: string;
  Acc_RegistrationNumber__c?: string;
  Acc_ParticipantSize__c?: string;
  ParticipantSizeLabel?: string;
  Acc_Employees__c?: number;
  Acc_TurnoverYearEnd__c?: string;
  Acc_Turnover__c?: number;
  Acc_Location__c?: string;
  ProjectLocationLabel?: string;
  Acc_ProjectCity__c?: string;
  Acc_ProjectPostcode__c?: string;
  Acc_Contact1ProjectRole__c?: string;
  Contact1ProjectRoleLabel?: string;
  Acc_Contact1Forename__c?: string;
  Acc_Contact1Surname__c?: string;
  Acc_Contact1Phone__c?: string;
  Acc_Contact1EmailAddress__c?: string;
  Acc_Contact2ProjectRole__c?: string;
  Contact2ProjectRoleLabel?: string;
  Acc_Contact2Forename__c?: string;
  Acc_Contact2Surname__c?: string;
  Acc_Contact2Phone__c?: string;
  Acc_Contact2EmailAddress__c?: string;
  Acc_AwardRate__c?: number;
  Acc_OtherFunding__c?: boolean;
  Acc_TotalOtherFunding__c?: number;
  Acc_CommercialWork__c?: boolean;
  Acc_TSBReference__c?: string;
  Acc_GrantMovingOverFinancialYear__c?: number;
  Loan_ProjectStartDate__c?: string;
  Loan_Duration__c?: string;
  Loan_ExtensionPeriod__c?: string;
  Loan_ExtensionPeriodChange__c?: string;
  Loan_RepaymentPeriod__c?: string;
  Loan_RepaymentPeriodChange__c?: string;
}

type ProjectChangeRequestData = ProjectChangeRequestHeaderData | ProjectChangeRequestChildData;

export { ProjectChangeRequestData };
