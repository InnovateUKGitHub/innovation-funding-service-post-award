import { LoadableDate } from "../loader/LoadDate";

interface ProjectData {
  Acc_ProjectNumber__c: string;
  Acc_LegacyID__c: string;
  Acc_ProjectTitle__c: string;
  Acc_StartDate__c: LoadableDate;
  /**
   * @asType integer
   */
  Acc_Duration__c: number;
  Acc_WorkdayProjectSetupComplete__c: boolean;
  Acc_MonitoringLevel__c:
    | "Platinum"
    | "Gold"
    | "Silver"
    | "Bronze"
    | "Internal Assurance";
  Acc_MonitoringReportSchedule__c:
    | "Monthly"
    | "Quarterly"
    | "6 Monthly"
    | "Yearly"
    | "Internal Assurance";
  Acc_ClaimFrequency__c: "Monthly" | "Quarterly";
  Acc_ProjectStatus__c:
    | "Not set"
    | "PCL Creation Complete"
    | "Offer Letter Sent"
    | "Live"
    | "On Hold"
    | "Final Claim"
    | "Closed"
    | "Terminated";
}

export { ProjectData };
