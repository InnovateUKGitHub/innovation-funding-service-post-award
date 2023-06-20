import { PCRItemType, PCRItemDisabledReason } from "@framework/constants/pcrConstants";
import { PCRItemTypeDto } from "@framework/dtos/pcrDtos";
import { RecordType } from "@framework/entities/recordType";
import { IContext } from "@framework/types/IContext";
import { IConfig } from "../common/config";
import { QueryBase } from "../common/queryBase";
import { GetAllRecordTypesQuery } from "../general/getAllRecordTypesQuery";
import { GetByIdQuery } from "../projects/getDetailsByIdQuery";

interface IMetaValue {
  ignoredCompetitions: string[];
  type: PCRItemType;
  typeName: string;
  displayName?: string;
  files?: string[];
  guidance?: string;
  deprecated?: boolean;
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

const multiplePartnerFinancialVirementGuidance = `You need to submit a reallocate project costs spreadsheet. In the yellow boxes enter the names of all partner organisations, their current costs and the costs you are proposing. Enter all partners’ details. There are separate tables for businesses and academic organisations.

You must not:

* increase the combined grant funding within the collaboration
* exceed any individual partner’s award rate limit

You should not increase the overhead percentage rate.
`;

export class GetPCRItemTypesQuery extends QueryBase<PCRItemTypeDto[]> {
  constructor(public readonly projectId: ProjectId) {
    super();
  }

  protected async run(context: IContext): Promise<PCRItemTypeDto[]> {
    const recordTypes = await context.runQuery(new GetAllRecordTypesQuery());
    const { competitionType } = await context.runQuery(new GetByIdQuery(this.projectId));

    const recordMetaValues = GetPCRItemTypesQuery.recordTypeMetaValues.filter(
      x => !x.ignoredCompetitions.includes(competitionType),
    );

    const pcrRecordTypes = recordTypes.filter(x => x.parent === "Acc_ProjectChangeRequest__c");

    return recordMetaValues.map<PCRItemTypeDto>(metaInfo => ({
      type: metaInfo.type,
      displayName: metaInfo.displayName || metaInfo.typeName,
      enabled: this.getEnabledStatus(metaInfo, context.config),
      disabled: false,
      disabledReason: PCRItemDisabledReason.None,
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
    if (metaInfo.deprecated) return false;

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
   * @description There is no mechanism to support filtering, hence this manual list. The order dictates the UI order what will be presented.
   *
   * If the db has an entry but it is not defined here then it will not be available through the api.
   */
  static readonly recordTypeMetaValues: IMetaValue[] = [
    {
      type: PCRItemType.MultiplePartnerFinancialVirement,
      typeName: "Reallocate several partners' project cost",
      files: ["reallocate-project-costs.xlsx"],
      displayName: "Reallocate project costs",
      guidance: multiplePartnerFinancialVirementGuidance,
      ignoredCompetitions: [],
    },
    {
      type: PCRItemType.PartnerWithdrawal,
      typeName: "Remove a partner",
      ignoredCompetitions: ["LOANS"],
    },
    {
      type: PCRItemType.PartnerAddition,
      typeName: "Add a partner",
      files: ["de-minimis-declaration.odt"],
      guidance: partnerAdditionGuidance,
      ignoredCompetitions: ["LOANS"],
    },
    {
      type: PCRItemType.ScopeChange,
      typeName: "Change project scope",
      guidance: scopeChangeGuidance,
      ignoredCompetitions: [],
    },
    {
      type: PCRItemType.TimeExtension,
      typeName: "Change project duration",
      ignoredCompetitions: ["LOANS"],
    },
    {
      type: PCRItemType.PeriodLengthChange,
      typeName: "Change period length",
      ignoredCompetitions: [
        "CR&D",
        "CONTRACTS",
        "KTP",
        "CATAPULTS",
        "LOANS",
        "EDGE",
        "SBRI",
        "SBRI IFS",
        "Horizon Europe Participation",
      ],
    },
    {
      type: PCRItemType.AccountNameChange,
      typeName: "Change a partner's name",
      guidance: nameChangeGuidance,
      ignoredCompetitions: ["LOANS"],
    },
    {
      type: PCRItemType.ProjectSuspension,
      typeName: "Put project on hold",
      ignoredCompetitions: [],
    },
    {
      type: PCRItemType.ProjectTermination,
      typeName: "End the project early",
      ignoredCompetitions: ["LOANS"],
      deprecated: true,
    },
    {
      type: PCRItemType.LoanDrawdownChange,
      typeName: "Loan Drawdown Change",
      ignoredCompetitions: [
        "CR&D",
        "CONTRACTS",
        "KTP",
        "CATAPULTS",
        "EDGE",
        "SBRI",
        "SBRI IFS",
        "Horizon Europe Participation",
      ],
    },
    {
      type: PCRItemType.LoanDrawdownExtension,
      typeName: "Change Loans Duration",
      ignoredCompetitions: [
        "CR&D",
        "CONTRACTS",
        "KTP",
        "CATAPULTS",
        "EDGE",
        "SBRI",
        "SBRI IFS",
        "Horizon Europe Participation",
      ],
    },
  ];
}
