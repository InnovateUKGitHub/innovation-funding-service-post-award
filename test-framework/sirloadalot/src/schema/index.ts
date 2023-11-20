import { RecordType } from "../enum/RecordType";
import { LoadableDate } from "../loader/LoadDate";
import { CostCategoryLookup } from "./CostCategory.lookup";
import { MonitoringAnswerData } from "./MonitoringAnswer.data";
import { MonitoringQuestionLookup } from "./MonitoringQuestion.lookup";
import { ProjectData } from "./Project.data";
import { RecordTypeLookup } from "./RecordType.lookup";
import { FileData } from "./file";
import { CompetitionType, Lookup } from "./helper";
import { ProfileData } from "./Profile.data";
import { ClaimData } from "./Claim.data";
import { ProjectChangeRequestData } from "./ProjectChangeRequest.data";
import { ApiName } from "../enum/ApiName";

export type LoadableValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | LoadableDate
  | Lookup<CostCategoryLookup>
  | Lookup<RecordTypeLookup<RecordType, ApiName>>
  | Lookup<MonitoringQuestionLookup>;

export interface BaseFileData {
  Competition__c: {
    loadId?: string;
    data: CompetitionData;
    relationship: undefined;
    files?: FileData[];
  }[];
  Account: {
    loadId?: string;
    data: AccountData;
    relationship: undefined;
    files?: FileData[];
  }[];
  Contact: {
    loadId?: string;
    data: ContactData;
    relationship: { Account: string };
    files?: FileData[];
  }[];
  User: {
    loadId?: string;
    data: UserData;
    relationship: { Contact: string };
    files?: FileData[];
  }[];
  Acc_Project__c: {
    loadId?: string;
    data: ProjectData;
    relationship: { Competition__c: string };
    files?: FileData[];
  }[];
  Acc_ProjectParticipant__c: {
    loadId?: string;
    data: ProjectParticipantData;
    relationship: { Acc_Project__c: string; Account: string };
    files?: FileData[];
  }[];
  Acc_ProjectContactLink__c: {
    loadId?: string;
    data: ProjectContactLinkData;
    relationship: { Acc_Project__c: string; Account: string; Contact: string };
    files?: FileData[];
  }[];
  Acc_Profile__c: {
    loadId?: string;
    data: ProfileData;
    relationship: { Acc_ProjectParticipant__c: string };
    files?: FileData[];
  }[];
  Acc_Claims__c: {
    loadId?: string;
    data: ClaimData;
    relationship: { Acc_ProjectParticipant__c: string };
    files?: FileData[];
  }[];
  Acc_ProjectChangeRequest__c: {
    loadId?: string;
    data: ProjectChangeRequestData;
    relationship: {
      Acc_Project__c: string;
      Acc_ProjectChangeRequest__c?: string;
    };
    files?: FileData[];
  }[];
  Acc_MonitoringAnswer__c: {
    loadId?: string;
    data: MonitoringAnswerData;
    relationship: { Acc_Project__c: string } | { Acc_MonitoringAnswer__c: string };
    files?: FileData[];
  }[];
}

interface CompetitionData {
  Acc_CompetitionCode__c: string;
  Acc_CompetitionName__c: string;
  Acc_CompetitionType__c: CompetitionType;
  Impact_Management_Participation__c: string;
  // IM_PhasedCompetition__c: boolean;
  Phased_Competition_Stage__c: string;
}

interface AccountData {
  OrgMigrationId__c: string;
  Name: string;
  BillingStreet: string;
  BillingCity: string;
  BillingState: string;
  BillingPostalCode: string;
  BillingCountry: string;
}

interface ContactData {
  ContactMigrationId__c: string;
  FirstName: string;
  LastName: string;
  Email: string;
}

interface UserData {
  Username: string;
  Email: string;
  FirstName: string;
  LastName: string;
  Alias: string;
  CommunityNickname: string;
  EmailEncodingKey: "UTF-8";
  LocaleSidKey: "en_GB";
  LanguageLocaleKey: "en_US";
  TimeZoneSidKey: "Europe/London";
  ProfileId: "00e58000001ITpLAAW";
}

interface ProjectParticipantData {
  ParticipantMigrationID__c: string;
  Acc_ParticipantType__c: string;
  Acc_ParticipantSize__c: string;
  Acc_ProjectRole__c: string;
  Acc_AuditReportFrequency__c: string;
  Acc_ParticipantStatus__c: string;
  Acc_Award_Rate__c: number;
  Acc_Cap_Limit__c: number;
  Acc_FlaggedParticipant__c: boolean;
  Acc_OverheadRate__c: number;
  Acc_ParticipantProjectReportingType__c: string;
  Acc_OrganisationType__c: string;
  Acc_CreateClaims__c: boolean;
  Acc_CreateProfiles__c: boolean;
}

interface ProjectContactLinkData {
  Acc_Role__c: "Project Manager" | "Monitoring Officer" | "Finance Contact";
  Acc_EmailOfSFContact__c: string;
}
