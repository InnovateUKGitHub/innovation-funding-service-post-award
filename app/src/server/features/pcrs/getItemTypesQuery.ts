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
  { type: ProjectChangeRequestItemTypeEntity.AccountNameChange, typeName: "Change a partner's name" },
  { type: ProjectChangeRequestItemTypeEntity.PartnerAddition, typeName: "Add a partner", },
  { type: ProjectChangeRequestItemTypeEntity.PartnerWithdrawal, typeName: "Remove a partner", },
  { type: ProjectChangeRequestItemTypeEntity.ProjectSuspension, typeName: "Put project on hold", },
  { type: ProjectChangeRequestItemTypeEntity.ProjectTermination, typeName: "End the project early", },
  { type: ProjectChangeRequestItemTypeEntity.MultiplePartnerFinancialVirement, typeName: "Reallocate several partners' project cost", },
  { type: ProjectChangeRequestItemTypeEntity.SinglePartnerFinancialVirement, typeName: "Reallocate one partner's project costs", },
  { type: ProjectChangeRequestItemTypeEntity.ScopeChange, typeName: "Change project scope", },
  { type: ProjectChangeRequestItemTypeEntity.TimeExtension, typeName: "Change project duration", },
  // "Financial Virement"
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
