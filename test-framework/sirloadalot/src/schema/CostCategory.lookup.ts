import { CompetitionType } from "./helper";

interface CostCategoryLookup {
  type: "Acc_CostCategory__c";
  Acc_CostCategoryName__c:
    | "Labour"
    | "Overheads"
    | "Materials"
    | "Capital usage"
    | "Subcontracting"
    | "Travel and subsistence"
    | "Other costs"
    | "Other Costs 2"
    | "Other Costs 3"
    | "Other Costs 4"
    | "Other Costs 5"
    | "Directly incurred - Staff"
    | "Directly incurred - Travel and subsistence"
    | "Directly incurred - Equipment"
    | "Directly incurred - Other costs"
    | "Directly allocated - Investigations"
    | "Directly allocated - Estates costs"
    | "Directly allocated - Other costs"
    | "Indirect costs - Investigations"
    | "Exceptions - Staff"
    | "Exceptions - Travel and subsistence"
    | "Exceptions - Equipment"
    | "Exceptions - Other costs"
    | "VAT"
    | "Associate Employment"
    | "Consumables"
    | "Associate development"
    | "Knowledge base supervisor"
    | "Estate"
    | "Indirect costs"
    | "Additional associate support"
    | "Academic and secretarial support"
    | "Property Revenue"
    | "Other Costs - Resource"
    | "Capital Equipment"
    | "Property Capital"
    | "Capitalised Labour"
    | "Other costs- Capital"
    | "Advance on Grant"
    | "Other public sector funding"
    | "Loans costs for Industrial participants"
    | "Loans costs for Academic participants";
  Acc_OrganisationType__c: "Academic" | "Industrial";
  Acc_CompetitionType__c: CompetitionType;
}

export { CostCategoryLookup };
