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
  files?: string[];
}

// @TODO: this might sit better in the pcr repository... leave for now
export const PCRRecordTypeMetaValues: IMetaValue[] = [
  { type: ProjectChangeRequestItemTypeEntity.SinglePartnerFinancialVirement, typeName: "Reallocate one partner's project costs", files: ["partner_finance_form.xls"]},
  { type: ProjectChangeRequestItemTypeEntity.MultiplePartnerFinancialVirement, typeName: "Reallocate several partners' project cost", files: ["partner_finance_form.xls"]},
  { type: ProjectChangeRequestItemTypeEntity.PartnerWithdrawal, typeName: "Remove a partner", },
  { type: ProjectChangeRequestItemTypeEntity.PartnerAddition, typeName: "Add a partner", files: ["partner_addition.xlsx"] },
  { type: ProjectChangeRequestItemTypeEntity.ScopeChange, typeName: "Change project scope", },
  { type: ProjectChangeRequestItemTypeEntity.TimeExtension, typeName: "Change project duration", },
  { type: ProjectChangeRequestItemTypeEntity.AccountNameChange, typeName: "Change a partner's name", },
  { type: ProjectChangeRequestItemTypeEntity.ProjectSuspension, typeName: "Put project on hold", },
  { type: ProjectChangeRequestItemTypeEntity.ProjectTermination, typeName: "End the project early", },
];

export class GetPCRItemTypesQuery extends QueryBase<PCRItemTypeDto[]> {
  protected async Run(context: IContext) {

    const recordTypes = (await context.runQuery(new GetAllRecordTypesQuery()))
      .filter(x => x.parent === "Acc_ProjectChangeRequest__c");

    /// meta values controlls order
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
