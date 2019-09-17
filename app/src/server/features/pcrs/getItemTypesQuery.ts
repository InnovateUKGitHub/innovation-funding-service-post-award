import { QueryBase } from "../common";
import { PCRItemTypeDto } from "@framework/dtos/pcrDtos";
import { IContext } from "@framework/types";
import { ProjectChangeRequestItemTypeEntity, RecordType } from "@framework/entities";
import { GetAllRecordTypesQuery } from "../general/getAllRecordTypesQuery";

interface IMetaValue {
  type: ProjectChangeRequestItemTypeEntity;
  typeName: string;
  displayName?: string;
  enabled?: boolean;
}

// @TODO: this might sit better in the pcr repository... leave for now
export const PCRRecordTypeMetaValues: IMetaValue[] = [
  { type: ProjectChangeRequestItemTypeEntity.AccountNameChange, typeName: "Account Name Change" },
  { type: ProjectChangeRequestItemTypeEntity.PartnerAddition, typeName: "Partner Addition", },
  { type: ProjectChangeRequestItemTypeEntity.PartnerWithdrawal, typeName: "Partner Withdrawal", },
  { type: ProjectChangeRequestItemTypeEntity.ProjectSuspension, typeName: "Project Suspension", },
  { type: ProjectChangeRequestItemTypeEntity.ProjectTermination, typeName: "Project Termination", },
  { type: ProjectChangeRequestItemTypeEntity.MultiplePartnerFinancialVirement, typeName: "Multiple Partner Financial Virement", },
  { type: ProjectChangeRequestItemTypeEntity.SinglePartnerFinancialVirement, typeName: "Single Partner Financial Virement", },
  { type: ProjectChangeRequestItemTypeEntity.ScopeChange, typeName: "Scope Change", },
  { type: ProjectChangeRequestItemTypeEntity.TimeExtension, typeName: "Time Extension", },
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
