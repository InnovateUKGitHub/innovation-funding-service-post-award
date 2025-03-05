import { SObjectFieldType } from "../types/SObjectFieldType";
import { AbstractSObject, SObjectField } from "./AbstractProjectFactory";

class Competition__c extends AbstractSObject {
  public readonly sobject = "Competition__c";

  @SObjectField({ nullable: false, readonly: false })
  accessor Acc_CompetitionCode__c: SObjectFieldType<string>;

  @SObjectField({ nullable: false, readonly: false })
  accessor Acc_CompetitionType__c:
    | "CR&D"
    | "Contracts for Innovation"
    | "SBRI"
    | "SBRI IFS"
    | "KTP"
    | "CATAPULTS"
    | "LOANS"
    | "EDGE"
    | "Horizon Europe Participation"
    | "Combined Capital"
    | "Ofgem"
    | undefined;

  @SObjectField({ nullable: false, readonly: false })
  accessor Acc_CompetitionName__c: SObjectFieldType<string>;

  @SObjectField({ nullable: true, readonly: false })
  accessor Impact_Management_participation__c: SObjectFieldType<"Yes" | "No">;

  @SObjectField({ nullable: true, readonly: false })
  accessor SBRI_Contracting_Authority__c: SObjectFieldType<"Innovate UK">;
}

export { Competition__c };
