import { QueryBase } from "../common";
import { PCRItemTypeDto } from "@framework/dtos/pcrDtos";
import { IContext } from "@framework/types";
import { PCRItemType, RecordType } from "@framework/entities";
import { GetAllRecordTypesQuery } from "../general/getAllRecordTypesQuery";

interface MetaValue {
  id: PCRItemType;
  typeName: string;
  displayName?: string;
  enabled?: boolean;
}

// todo: this might sit better in the pcr repository... leave for now
export const PcrRecordTypeMetaValues: MetaValue[] = [
  { id: PCRItemType.AccountNameChange, typeName: "Account Name Change" },
  { id: PCRItemType.PartnerAddition, typeName: "Partner Addition", },
  { id: PCRItemType.PartnerWithdrawal, typeName: "Partner Withdrawal", },
  { id: PCRItemType.ProjectSuspension, typeName: "Project Suspension", },
  { id: PCRItemType.ProjectTermination, typeName: "Project Termination", },
  { id: PCRItemType.MultiplePartnerFinancialVirement, typeName: "Multiple Partner Financial Virement", },
  { id: PCRItemType.SinglePartnerFinancialVirement, typeName: "Single Partner Financial Virement", },
  { id: PCRItemType.ScopeChange, typeName: "Scope Change", },
  { id: PCRItemType.TimeExtension, typeName: "Time Extension", },
];

export class GetPCRItemTypesQuery extends QueryBase<PCRItemTypeDto[]> {
  protected async Run(context: IContext) {

    const recordTypes = (await context.runQuery(new GetAllRecordTypesQuery()))
      .filter(x => x.parent === "Acc_ProjectChangeRequest__c");

    /// meta values controlls order
    return PcrRecordTypeMetaValues
      .map<PCRItemTypeDto>(x => ({
        id: x.id,
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
