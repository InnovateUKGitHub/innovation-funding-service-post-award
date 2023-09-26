import { SalesforceCompetitionTypes } from "@framework/constants/competitionTypes";
import { PCRItemType } from "@framework/constants/pcrConstants";

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

export const pcrRecordTypeMetaValues = [
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
    ignoredCompetitions: [SalesforceCompetitionTypes.loans],
  },
  {
    type: PCRItemType.PartnerAddition,
    typeName: "Add a partner",
    files: ["de-minimis-declaration.odt"],
    guidance: partnerAdditionGuidance,
    ignoredCompetitions: [SalesforceCompetitionTypes.loans],
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
    ignoredCompetitions: [SalesforceCompetitionTypes.loans],
  },
  {
    type: PCRItemType.PeriodLengthChange,
    typeName: "Change period length",
    ignoredCompetitions: [
      SalesforceCompetitionTypes.crnd,
      SalesforceCompetitionTypes.contracts,
      SalesforceCompetitionTypes.ktp,
      SalesforceCompetitionTypes.catapults,
      SalesforceCompetitionTypes.loans,
      SalesforceCompetitionTypes.edge,
      SalesforceCompetitionTypes.sbri,
      SalesforceCompetitionTypes.sbriIfs,
      SalesforceCompetitionTypes.horizonEurope,
    ],
  },
  {
    type: PCRItemType.AccountNameChange,
    typeName: "Change a partner's name",
    guidance: nameChangeGuidance,
    ignoredCompetitions: [SalesforceCompetitionTypes.loans],
  },
  {
    type: PCRItemType.ProjectSuspension,
    typeName: "Put project on hold",
    ignoredCompetitions: [],
  },
  {
    type: PCRItemType.ProjectTermination,
    typeName: "End the project early",
    ignoredCompetitions: [SalesforceCompetitionTypes.loans],
    deprecated: true,
  },
  {
    type: PCRItemType.LoanDrawdownChange,
    typeName: "Loan Drawdown Change",
    ignoredCompetitions: [
      SalesforceCompetitionTypes.crnd,
      SalesforceCompetitionTypes.contracts,
      SalesforceCompetitionTypes.ktp,
      SalesforceCompetitionTypes.catapults,
      SalesforceCompetitionTypes.edge,
      SalesforceCompetitionTypes.sbri,
      SalesforceCompetitionTypes.sbriIfs,
      SalesforceCompetitionTypes.horizonEurope,
    ],
  },
  {
    type: PCRItemType.LoanDrawdownExtension,
    typeName: "Change Loans Duration",
    ignoredCompetitions: [
      SalesforceCompetitionTypes.crnd,
      SalesforceCompetitionTypes.contracts,
      SalesforceCompetitionTypes.ktp,
      SalesforceCompetitionTypes.catapults,
      SalesforceCompetitionTypes.edge,
      SalesforceCompetitionTypes.sbri,
      SalesforceCompetitionTypes.sbriIfs,
      SalesforceCompetitionTypes.horizonEurope,
    ],
  },
] as const;
