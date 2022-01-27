import { PCRItemTypeDto } from "@framework/dtos/pcrDtos";
import { IContext } from "@framework/types";
import { PCRItemType } from "@framework/constants";
import { RecordType } from "@framework/entities";
import { GetAllRecordTypesQuery } from "../general/getAllRecordTypesQuery";
import { IConfig, QueryBase } from "../common";
import { GetByIdQuery } from "../projects";

interface IMetaValue {
  competitions: string[];
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

const partnerAdditionGuidance = undefined;

const singlePartnerFinancialVirementGuidance = `You need to submit a reallocate project costs spreadsheet. In the yellow boxes enter the names of all partner organisations, their current costs and the costs you are proposing. Enter all partners’ details. There are separate tables for businesses and academic organisations.

You must not:

* increase the combined grant funding within the collaboration
* exceed any individual partner’s award rate limit

You should not increase the overhead percentage rate.
`;

const multiplePartnerFinancialVirementGuidance = `You need to submit a reallocate project costs spreadsheet. In the yellow boxes enter the names of all partner organisations, their current costs and the costs you are proposing. Enter all partners’ details. There are separate tables for businesses and academic organisations.

You must not:

* increase the combined grant funding within the collaboration
* exceed any individual partner’s award rate limit

You should not increase the overhead percentage rate.
`;

export class GetPCRItemTypesQuery extends QueryBase<PCRItemTypeDto[]> {
  constructor(public readonly projectId: string) {
    super();
  }

  protected async run(context: IContext): Promise<PCRItemTypeDto[]> {
    const project = await context.runQuery(new GetByIdQuery(this.projectId));
    const recordTypes = await context.runQuery(new GetAllRecordTypesQuery());

    const recordMetaValues = GetPCRItemTypesQuery.recordTypeMetaValues.filter(x =>
      x.competitions.includes(project.competitionType),
    );

    const pcrRecordTypes = recordTypes.filter(x => x.parent === "Acc_ProjectChangeRequest__c");

    return recordMetaValues.map<PCRItemTypeDto>(metaInfo => ({
      type: metaInfo.type,
      displayName: metaInfo.displayName || metaInfo.typeName,
      enabled: this.getEnabledStatus(metaInfo, context.config),
      disabled: false,
      recordTypeId: this.findRecordType(metaInfo.typeName, pcrRecordTypes),
      files: this.getPCRFiles(metaInfo.files),
    }));
  }

  private getPCRFiles(metaInfoFiles: IMetaValue["files"]): PCRItemTypeDto["files"] {
    if (!metaInfoFiles?.length) return [];

    return metaInfoFiles.map(file => ({
      name: file,
      relativeUrl: `/ifspa-assets/pcr_templates/${file}`,
    }));
  }

  private getEnabledStatus(metaInfo: IMetaValue, config: IConfig): boolean {
    // TODO: Raise ticket to remove this PCRItemType since we use 'MultiplePartnerFinancialVirement' in replacement
    if (metaInfo.type === PCRItemType.SinglePartnerFinancialVirement) {
      return false;
    }

    if (metaInfo.type === PCRItemType.MultiplePartnerFinancialVirement) {
      return true;
    }

    // TODO: Raise ticket to remove this... Currently we have no matching competitions for this PCRItemType
    if (metaInfo.type === PCRItemType.PeriodLengthChange) {
      return config.features.changePeriodLengthWorkflow;
    }
    return true;
  }

  private findRecordType(typeName: string, recordTypes: RecordType[]): string {
    const recordType = recordTypes.find(y => y.type === typeName);
    return recordType?.id || "Unknown";
  }

  /**
   * @description The DB does not support filtering by competition, so we introduce support here on this static array via 'competitions'.
   *
   * To be clear, the PCR items types will adhere to this order. If the db has an entry but it is not defined here then it will not be available through the api.
   */
  static readonly recordTypeMetaValues: IMetaValue[] = [
    {
      type: PCRItemType.SinglePartnerFinancialVirement,
      competitions: [],
      // competitions: ["CR&D", "CONTRACTS", "KTP", "CATAPULTS", "LOANS", "SBRI", "SBRI IFS"],
      typeName: "Reallocate one partner's project costs",
      files: ["reallocate-project-costs.xlsx"],
      displayName: "Reallocate project costs",
      guidance: singlePartnerFinancialVirementGuidance,
    },
    {
      type: PCRItemType.MultiplePartnerFinancialVirement,
      competitions: ["CR&D", "CONTRACTS", "KTP", "CATAPULTS", "LOANS", "SBRI", "SBRI IFS", "EDGE"],
      typeName: "Reallocate several partners' project cost",
      files: ["reallocate-project-costs.xlsx"],
      displayName: "Reallocate project costs",
      guidance: multiplePartnerFinancialVirementGuidance,
    },
    {
      type: PCRItemType.PartnerWithdrawal,
      competitions: ["CR&D", "CONTRACTS", "KTP", "CATAPULTS", "SBRI", "SBRI IFS", "EDGE"],
      typeName: "Remove a partner",
    },
    {
      type: PCRItemType.PartnerAddition,
      competitions: ["CR&D", "CONTRACTS", "KTP", "CATAPULTS", "SBRI", "SBRI IFS", "EDGE"],
      typeName: "Add a partner",
      files: ["de-minimis-declaration.odt"],
      guidance: partnerAdditionGuidance,
    },
    {
      type: PCRItemType.ScopeChange,
      competitions: ["CR&D", "CONTRACTS", "KTP", "CATAPULTS", "LOANS", "SBRI", "SBRI IFS", "EDGE"],
      typeName: "Change project scope",
      guidance: scopeChangeGuidance,
    },
    {
      type: PCRItemType.TimeExtension,
      competitions: ["CR&D", "CONTRACTS", "KTP", "CATAPULTS", "LOANS", "SBRI", "SBRI IFS", "EDGE"],
      typeName: "Change project duration",
    },
    {
      type: PCRItemType.PeriodLengthChange,
      competitions: [],
      typeName: "Change period length",
    },
    {
      type: PCRItemType.AccountNameChange,
      competitions: ["CR&D", "CONTRACTS", "KTP", "CATAPULTS", "SBRI", "SBRI IFS", "EDGE"],
      typeName: "Change a partner's name",
      guidance: nameChangeGuidance,
    },
    {
      type: PCRItemType.ProjectSuspension,
      competitions: ["CR&D", "CONTRACTS", "KTP", "CATAPULTS", "LOANS", "SBRI", "SBRI IFS", "EDGE"],
      typeName: "Put project on hold",
    },
    {
      type: PCRItemType.ProjectTermination,
      competitions: ["CR&D", "CONTRACTS", "KTP", "CATAPULTS", "SBRI", "SBRI IFS", "EDGE"],
      typeName: "End the project early",
    },
    {
      type: PCRItemType.LoanDrawdownChange,
      competitions: ["LOANS"],
      typeName: "Loan Drawdown Change",
    },
  ].filter(x => {
    // Note: Filter any non-competitions
    return x.competitions.length > 0;
  });
}
