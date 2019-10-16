import { QueryBase } from "../common";
import { PCRItemTypeDto } from "@framework/dtos/pcrDtos";
import { IContext } from "@framework/types";
import { GetAllRecordTypesQuery } from "../general/getAllRecordTypesQuery";
import { PCRItemType } from "@framework/constants";
import { RecordType } from "@framework/entities";

interface IMetaValue {
  type: PCRItemType;
  typeName: string;
  displayName?: string;
  enabled?: boolean;
  files?: string[];
}

// @TODO: this might sit better in the pcr repository (or constants?) ... leave for now
export const PCRRecordTypeMetaValues: IMetaValue[] = [
  { type: PCRItemType.SinglePartnerFinancialVirement, typeName: "Reallocate one partner's project costs", files: ["partner_finance_form.xls"]},
  { type: PCRItemType.MultiplePartnerFinancialVirement, typeName: "Reallocate several partners' project cost", files: ["partner_finance_form.xls"]},
  { type: PCRItemType.PartnerWithdrawal, typeName: "Remove a partner", },
  { type: PCRItemType.PartnerAddition, typeName: "Add a partner", files: ["partner_addition.xlsx"] },
  { type: PCRItemType.ScopeChange, typeName: "Change project scope", },
  { type: PCRItemType.TimeExtension, typeName: "Change project duration", },
  { type: PCRItemType.AccountNameChange, typeName: "Change a partner's name", },
  { type: PCRItemType.ProjectSuspension, typeName: "Put project on hold", },
  { type: PCRItemType.ProjectTermination, typeName: "End the project early", },
];

export class GetPCRItemTypesQuery extends QueryBase<PCRItemTypeDto[]> {
  protected async Run(context: IContext) {

    const recordTypes = (await context.runQuery(new GetAllRecordTypesQuery()))
      .filter(x => x.parent === "Acc_ProjectChangeRequest__c");

    /// meta values controls order
    return PCRRecordTypeMetaValues
      .map<PCRItemTypeDto>(metaInfo => ({
        type: metaInfo.type,
        displayName: metaInfo.displayName || metaInfo.typeName,
        enabled: metaInfo.enabled === undefined ? true : metaInfo.enabled,
        recordTypeId: this.findRecordType(metaInfo.typeName, recordTypes),
        files: metaInfo.files && metaInfo.files.map(file => ({ name: file, relativeUrl: `/assets/pcr_templates/${file}` })) || []
      }));
  }

  private findRecordType(typeName: string, recordTypes: RecordType[]): string {
    const result = recordTypes.find(y => y.type === typeName);
    return result && result.id || "Unknown";
  }
}
