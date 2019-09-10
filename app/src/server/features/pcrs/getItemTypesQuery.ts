import { QueryBase } from "../common";
import { PCRItemTypeDto } from "@framework/dtos/pcrDtos";
import { IContext } from "@framework/types";
import { PCRItemType, RecordType } from "@framework/entities";
import { GetAllRecordTypesQuery } from "../general/getAllRecordTypesQuery";

interface IMetaValue {
  type: PCRItemType;
  typeName: string;
  displayName?: string;
  enabled?: boolean;
}

// todo: this might sit better in the pcr repository... leave for now
export const PCRRecordTypeMetaValues: IMetaValue[] = [
  { type: PCRItemType.AccountNameChange, typeName: "Account Name Change" },
  { type: PCRItemType.PartnerAddition, typeName: "Partner Addition", },
  { type: PCRItemType.PartnerWithdrawal, typeName: "Partner Withdrawal", },
  { type: PCRItemType.ProjectSuspension, typeName: "Project Suspension", },
  { type: PCRItemType.ProjectTermination, typeName: "Project Termination", },
  { type: PCRItemType.MultiplePartnerFinancialVirement, typeName: "Multiple Partner Financial Virement", },
  { type: PCRItemType.SinglePartnerFinancialVirement, typeName: "Single Partner Financial Virement", },
  { type: PCRItemType.ScopeChange, typeName: "Scope Change", },
  { type: PCRItemType.TimeExtension, typeName: "Time Extension", },
];

export class GetPCRItemTypesQuery extends QueryBase<PCRItemTypeDto[]> {
  protected async Run(context: IContext) {

    const recordTypes = (await context.runQuery(new GetAllRecordTypesQuery()))
      .filter(x => x.parent === "Acc_ProjectChangeRequest__c");

    /// meta values controlls order
    return PCRRecordTypeMetaValues
      .map<PCRItemTypeDto>(x => ({
        type: x.type,
        displayName: x.displayName || x.typeName,
        enabled: x.enabled === undefined ? true : x.enabled,
        recordTypeId: this.findRecordType(x.typeName, recordTypes)
      }));
  }

  private findRecordType(typeName: string, recordTypes: RecordType[]): string {
    const result = recordTypes.find(y => y.type === typeName);
    return result && result.id || "Unknown";
  }
}
