import { Configuration, IConfig, QueryBase } from "../common";
import { PCRItemTypeDto } from "@framework/dtos/pcrDtos";
import { IContext } from "@framework/types";
import { GetAllRecordTypesQuery } from "../general/getAllRecordTypesQuery";
import { PCRItemType } from "@framework/constants";
import { RecordType } from "@framework/entities";

interface IMetaValue {
  type: PCRItemType;
  typeName: string;
  displayName?: string;
  files?: string[];
  guidance?: string;
}

const scopeChangeGuidance = `Your public description is published in line with government practice on openness and transparency of public-funded activities. It should describe your project in a way that will be easy for a non-specialist to understand. Do not include any information that is confidential, for example, intellectual property or patent details.

Your project summary should provide a clear overview of the whole project, including:

* your vision for the project
* key objectives
* main areas of focus
* details of how it is innovative
`;

const nameChangeGuidance = `This will change the partner's name in all projects they are claiming funding for. You must upload a change of name certificate from Companies House as evidence of the change.
`;

const partnerAdditionGuidance = Configuration.features.addPartnerWorkflow ? undefined : `If the new partner is a business you need to send them an industrial partner finance form to apply to take part. Tell them to complete it and email it to your monitoring officer. Innovate UK will decide whether to approve their application.

If the new partner is an academic, you need to tell them to complete a Je-S form and email it to your monitoring officer.

You must also upload these documents:

*  a letter on one partner’s headed paper signed by the whole consortium, confirming all partners are happy with the new partner joining the consortium
*  a letter on headed paper from the new partner saying they want to join the project
*  a brief list of the outstanding deliverables, and who each will be assigned to once the partner joins
`;

const singlePartnerFinancialVirementGuidance = `You need to submit a reallocate project costs spreadsheet. In the yellow boxes enter the names of all partner organisations, their current costs and the costs you are proposing. Enter all partners’ details. There are separate tables for businesses and academic organisations.

You must not:

*  increase the combined grant funding within the collaboration
*  exceed any individual partner’s award rate limit

You should not increase the overhead percentage rate.
`;

const multiplePartnerFinancialVirementGuidance = `You need to submit a reallocate project costs spreadsheet. In the yellow boxes enter the names of all partner organisations, their current costs and the costs you are proposing. Enter all partners’ details. There are separate tables for businesses and academic organisations.

You must not:

*  increase the combined grant funding within the collaboration
*  exceed any individual partner’s award rate limit

You should not increase the overhead percentage rate.
`;

// @TODO: this might sit better in the pcr repository (or constants?) ... leave for now
export const PCRRecordTypeMetaValues: IMetaValue[] = [
  { type: PCRItemType.SinglePartnerFinancialVirement, typeName: "Reallocate one partner's project costs", files: ["reallocate-project-costs.xlsx"], displayName: "Reallocate project costs", guidance: singlePartnerFinancialVirementGuidance },
  { type: PCRItemType.MultiplePartnerFinancialVirement, typeName: "Reallocate several partners' project cost", files: ["reallocate-project-costs.xlsx"], displayName: "Reallocate project costs", guidance: multiplePartnerFinancialVirementGuidance },
  { type: PCRItemType.PartnerWithdrawal, typeName: "Remove a partner" },
  { type: PCRItemType.PartnerAddition, typeName: "Add a partner", files: ["partner_addition.xlsx"], guidance: partnerAdditionGuidance },
  { type: PCRItemType.ScopeChange, typeName: "Change project scope", guidance: scopeChangeGuidance },
  { type: PCRItemType.TimeExtension, typeName: "Change project duration" },
  { type: PCRItemType.PeriodLengthChange, typeName: "Change period length" },
  { type: PCRItemType.AccountNameChange, typeName: "Change a partner's name", guidance: nameChangeGuidance },
  { type: PCRItemType.ProjectSuspension, typeName: "Put project on hold" },
  { type: PCRItemType.ProjectTermination, typeName: "End the project early" },
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
        enabled: this.getEnabledStatus(metaInfo, context.config),
        recordTypeId: this.findRecordType(metaInfo.typeName, recordTypes),
        files: metaInfo.files && metaInfo.files.map(file => ({ name: file, relativeUrl: `/assets/pcr_templates/${file}` })) || []
      }));
  }

  private getEnabledStatus(metaInfo: IMetaValue, config: IConfig): boolean {
    if (metaInfo.type === PCRItemType.SinglePartnerFinancialVirement) {
      return !config.features.financialVirements;
    }
    if (metaInfo.type === PCRItemType.MultiplePartnerFinancialVirement) {
      return config.features.financialVirements;
    }
    return true;
  }

  private findRecordType(typeName: string, recordTypes: RecordType[]): string {
    const result = recordTypes.find(y => y.type === typeName);
    return result && result.id || "Unknown";
  }
}
