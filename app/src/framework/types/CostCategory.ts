import { CostCategoryType, CostCategoryGroupType } from ".";

interface ICostCategoryType {
  id: CostCategoryType;
  name: string;
  showGuidance: boolean;
  guidanceMessageKey: string;
  showPreGuidanceWarning: boolean;
  preGuidanceWarningMessageKey: string;
  group: CostCategoryGroupType | null;
}

type ICostCategoryTypeCompetitionOverrides = Record<string, Partial<ICostCategoryType>>;
interface ICostCategoryTypeCompetitionOverridable extends ICostCategoryType {
  overrides?: ICostCategoryTypeCompetitionOverrides;
}

/**
 * A cost category with a name that is exactly the same as what is stored
 * within Salesforce.
 *
 * Contains information on how to process the cost category,
 * such as which guidance message to use, what input fields it may share and
 * what ID the CostCategory has.
 *
 * @author Leondro Lio <leondro.lio@iuk.ukri.org>
 */
class CostCategoryItem {
  id: CostCategoryType;
  name: string;
  showGuidance: boolean;
  guidanceMessageKey: string;
  showPreGuidanceWarning: boolean;
  preGuidanceWarningMessageKey: string;
  group: CostCategoryGroupType | null;

  constructor(
    {
      id,
      name,
      showGuidance,
      guidanceMessageKey,
      showPreGuidanceWarning,
      preGuidanceWarningMessageKey,
      group,
      overrides,
    }: ICostCategoryTypeCompetitionOverridable,
    competitionType?: string,
  ) {
    // Apply all default CostCategory items.
    this.id = id;
    this.name = name;
    this.showGuidance = showGuidance;
    this.guidanceMessageKey = guidanceMessageKey;
    this.preGuidanceWarningMessageKey = preGuidanceWarningMessageKey;
    this.showPreGuidanceWarning = showPreGuidanceWarning;
    this.group = group;

    // Apply any overrides for this specific competitionType.
    if (overrides && competitionType && competitionType in overrides) {
      Object.assign(this, overrides[competitionType]);
    }
  }
}

const items: ICostCategoryTypeCompetitionOverridable[] = [
  {
    id: CostCategoryType.Other_Funding,
    name: "Other funding",
    guidanceMessageKey: "cost-guidance-default",
    showGuidance: false,
    preGuidanceWarningMessageKey: "cost-guidance-default",
    showPreGuidanceWarning: false,
    group: CostCategoryGroupType.Other_Funding,
  },
  {
    id: CostCategoryType.Academic,
    name: "Academic",
    guidanceMessageKey: "cost-guidance-default",
    showGuidance: false,
    preGuidanceWarningMessageKey: "cost-guidance-default",
    showPreGuidanceWarning: false,
    group: CostCategoryGroupType.Academic,
  },
  {
    id: CostCategoryType.Labour,
    name: "Labour",
    guidanceMessageKey: "cost-guidance-labour",
    showGuidance: true,
    preGuidanceWarningMessageKey: "cost-guidance-default",
    showPreGuidanceWarning: false,
    group: CostCategoryGroupType.Labour,
  },
  {
    id: CostCategoryType.Overheads,
    name: "Overheads",
    guidanceMessageKey: "cost-guidance-overheads",
    showGuidance: true,
    preGuidanceWarningMessageKey: "cost-guidance-default",
    showPreGuidanceWarning: false,
    group: CostCategoryGroupType.Overheads,
  },
  {
    id: CostCategoryType.Materials,
    name: "Materials",
    guidanceMessageKey: "cost-guidance-materials",
    showGuidance: true,
    preGuidanceWarningMessageKey: "cost-guidance-default",
    showPreGuidanceWarning: false,
    group: CostCategoryGroupType.Materials,
  },
  {
    id: CostCategoryType.Capital_Usage,
    name: "Capital usage",
    guidanceMessageKey: "cost-guidance-capital-usage",
    showGuidance: true,
    preGuidanceWarningMessageKey: "cost-guidance-default",
    showPreGuidanceWarning: false,
    group: CostCategoryGroupType.Capital_Usage,
  },
  {
    id: CostCategoryType.Subcontracting,
    name: "Subcontracting",
    guidanceMessageKey: "cost-guidance-subcontracting",
    showGuidance: true,
    preGuidanceWarningMessageKey: "cost-guidance-default",
    showPreGuidanceWarning: false,
    group: CostCategoryGroupType.Subcontracting,
    overrides: {
      KTP: {
        showGuidance: false,
        preGuidanceWarningMessageKey: "cost-pre-guidance-warning-subcontracting",
        showPreGuidanceWarning: true,
      },
    },
  },
  {
    id: CostCategoryType.Travel_And_Subsistence,
    name: "Travel and subsistence",
    guidanceMessageKey: "cost-guidance-travel-and-subs",
    showGuidance: true,
    preGuidanceWarningMessageKey: "cost-guidance-default",
    showPreGuidanceWarning: false,
    group: CostCategoryGroupType.Travel_And_Subsistence,
  },
  {
    id: CostCategoryType.Other_Costs,
    name: "Other costs",
    guidanceMessageKey: "cost-guidance-other-costs",
    showGuidance: true,
    preGuidanceWarningMessageKey: "cost-guidance-default",
    showPreGuidanceWarning: false,
    group: CostCategoryGroupType.Other_Costs,
  },
  {
    id: CostCategoryType.Other_Public_Sector_Funding,
    name: "Other public sector funding",
    guidanceMessageKey: "cost-guidance-default",
    showGuidance: false,
    preGuidanceWarningMessageKey: "cost-guidance-default",
    showPreGuidanceWarning: false,
    group: CostCategoryGroupType.Other_Funding,
  },
  {
    id: CostCategoryType.VAT,
    name: "VAT",
    guidanceMessageKey: "cost-guidance-default",
    showGuidance: false,
    preGuidanceWarningMessageKey: "cost-guidance-default",
    showPreGuidanceWarning: false,
    group: CostCategoryGroupType.Other_Costs,
  },
  {
    id: CostCategoryType.Advance_on_Grant,
    name: "Advance on Grant",
    guidanceMessageKey: "cost-guidance-default",
    showGuidance: false,
    preGuidanceWarningMessageKey: "cost-guidance-default",
    showPreGuidanceWarning: false,
    group: CostCategoryGroupType.Other_Costs,
  },
  {
    id: CostCategoryType.Capital_Equipment,
    name: "Capital Equipment",
    guidanceMessageKey: "cost-guidance-default",
    showGuidance: false,
    preGuidanceWarningMessageKey: "cost-guidance-default",
    showPreGuidanceWarning: false,
    group: CostCategoryGroupType.Other_Costs,
  },
  {
    id: CostCategoryType.Capitalised_Labour,
    name: "Capitalised Labour",
    guidanceMessageKey: "cost-guidance-default",
    showGuidance: false,
    preGuidanceWarningMessageKey: "cost-guidance-default",
    showPreGuidanceWarning: false,
    group: CostCategoryGroupType.Other_Costs,
  },
  {
    id: CostCategoryType.Other_Costs_Resource,
    name: "Other Costs - Resource",
    guidanceMessageKey: "cost-guidance-other-costs",
    showGuidance: true,
    preGuidanceWarningMessageKey: "cost-guidance-default",
    showPreGuidanceWarning: false,
    group: CostCategoryGroupType.Other_Costs,
  },
  {
    id: CostCategoryType.Other_Costs_Capital,
    name: "Other costs- Capital",
    guidanceMessageKey: "cost-guidance-other-costs",
    showGuidance: true,
    preGuidanceWarningMessageKey: "cost-guidance-default",
    showPreGuidanceWarning: false,
    group: CostCategoryGroupType.Other_Costs,
  },
  {
    id: CostCategoryType.Property_Capital,
    name: "Property Capital",
    guidanceMessageKey: "cost-guidance-default",
    showGuidance: false,
    preGuidanceWarningMessageKey: "cost-guidance-default",
    showPreGuidanceWarning: false,
    group: CostCategoryGroupType.Other_Costs,
  },
  {
    id: CostCategoryType.Property_Revenue,
    name: "Property Revenue",
    guidanceMessageKey: "cost-guidance-default",
    showGuidance: false,
    preGuidanceWarningMessageKey: "cost-guidance-default",
    showPreGuidanceWarning: false,
    group: CostCategoryGroupType.Other_Costs,
  },
  {
    id: CostCategoryType.Other_Costs_2,
    name: "Other Costs 2",
    guidanceMessageKey: "cost-guidance-other-costs",
    showGuidance: true,
    preGuidanceWarningMessageKey: "cost-guidance-default",
    showPreGuidanceWarning: false,
    group: CostCategoryGroupType.Other_Costs,
  },
  {
    id: CostCategoryType.Other_Costs_3,
    name: "Other Costs 3",
    guidanceMessageKey: "cost-guidance-other-costs",
    showGuidance: true,
    preGuidanceWarningMessageKey: "cost-guidance-default",
    showPreGuidanceWarning: false,
    group: CostCategoryGroupType.Other_Costs,
  },
  {
    id: CostCategoryType.Other_Costs_4,
    name: "Other Costs 4",
    guidanceMessageKey: "cost-guidance-other-costs",
    showGuidance: true,
    preGuidanceWarningMessageKey: "cost-guidance-default",
    showPreGuidanceWarning: false,
    group: CostCategoryGroupType.Other_Costs,
  },
  {
    id: CostCategoryType.Other_Costs_5,
    name: "Other Costs 5",
    guidanceMessageKey: "cost-guidance-other-costs",
    showGuidance: true,
    preGuidanceWarningMessageKey: "cost-guidance-default",
    showPreGuidanceWarning: false,
    group: CostCategoryGroupType.Other_Costs,
  },
  {
    id: CostCategoryType.Additional_associate_support,
    name: "Additional associate support",
    guidanceMessageKey: "cost-guidance-additional-associate-support",
    showGuidance: true,
    preGuidanceWarningMessageKey: "cost-guidance-default",
    showPreGuidanceWarning: false,
    group: CostCategoryGroupType.Other_Costs,
  },
  {
    id: CostCategoryType.Associate_development,
    name: "Associate development",
    guidanceMessageKey: "cost-guidance-associate-development",
    showGuidance: true,
    preGuidanceWarningMessageKey: "cost-guidance-default",
    showPreGuidanceWarning: false,
    group: CostCategoryGroupType.Other_Costs,
  },
  {
    id: CostCategoryType.Associate_Employment,
    name: "Associate Employment",
    guidanceMessageKey: "cost-guidance-associate-employment",
    showGuidance: true,
    preGuidanceWarningMessageKey: "cost-guidance-default",
    showPreGuidanceWarning: false,
    group: CostCategoryGroupType.Other_Costs,
  },
  {
    id: CostCategoryType.Consumables,
    name: "Consumables",
    guidanceMessageKey: "cost-guidance-consumables",
    showGuidance: true,
    preGuidanceWarningMessageKey: "cost-guidance-default",
    showPreGuidanceWarning: false,
    group: CostCategoryGroupType.Other_Costs,
  },
  {
    id: CostCategoryType.Estate,
    name: "Estate",
    guidanceMessageKey: "cost-guidance-estate",
    showGuidance: true,
    preGuidanceWarningMessageKey: "cost-guidance-default",
    showPreGuidanceWarning: false,
    group: CostCategoryGroupType.Other_Costs,
  },
  {
    id: CostCategoryType.Indirect_costs,
    name: "Indirect costs",
    guidanceMessageKey: "cost-guidance-indirect-costs",
    showGuidance: true,
    preGuidanceWarningMessageKey: "cost-guidance-default",
    showPreGuidanceWarning: false,
    group: CostCategoryGroupType.Other_Costs,
  },
  {
    id: CostCategoryType.Knowledge_base_supervisor,
    name: "Knowledge base supervisor",
    guidanceMessageKey: "cost-guidance-default",
    showGuidance: true,
    preGuidanceWarningMessageKey: "cost-guidance-default",
    showPreGuidanceWarning: false,
    group: CostCategoryGroupType.Other_Costs,
  },
  {
    id: CostCategoryType.Loans_costs_for_Industrial_participants,
    name: "Loans costs for Industrial participants",
    guidanceMessageKey: "cost-guidance-default",
    showGuidance: false,
    preGuidanceWarningMessageKey: "cost-guidance-default",
    showPreGuidanceWarning: false,
    group: CostCategoryGroupType.Other_Costs,
  },
];

/**
 * A class for finding a CostCategory based on either its Salesforce name
 * or the internal CostCategoryType.
 *
 * @author Leondro Lio <leondro.lio@iuk.ukri.org>
 */
class CostCategoryList {
  private readonly unknownCostCategory = new CostCategoryItem({
    id: CostCategoryType.Unknown,
    name: "Unknown Type",
    showGuidance: false,
    guidanceMessageKey: "cost-guidance-default",
    showPreGuidanceWarning: false,
    preGuidanceWarningMessageKey: "cost-guidance-default",
    group: null,
  });

  private readonly costCategories: CostCategoryItem[];

  /**
   * Create a lookup-table for retreiving information about Cost Categories.
   *
   * @param competitionType The type of competition type, if known, for changing guidance information.
   */
  constructor(competitionType?: string) {
    this.costCategories = [this.unknownCostCategory, ...items.map(item => new CostCategoryItem(item, competitionType))];
  }

  /**
   * Obtain cost category data from the Salesforce cost category name.
   *
   * @param type {CostCategoryType} The ID of the cost category.
   * @author Leondro Lio <leondro.lio@iuk.ukri.org>
   * @returns A cost category.
   */
  fromName(name: string) {
    const category = this.costCategories.find(costCategory => costCategory.name === name);
    if (category) return category;
    return this.unknownCostCategory;
  }

  /**
   * Obtain cost category data from a cost category id.
   *
   * @param type {CostCategoryType} The ID of the cost category.
   * @author Leondro Lio <leondro.lio@iuk.ukri.org>
   * @returns A cost category.
   */
  fromId(type: CostCategoryType) {
    const category = this.costCategories.find(costCategory => costCategory.id === type);
    if (category) return category;
    return this.unknownCostCategory;
  }
}

export { CostCategoryItem, CostCategoryList };