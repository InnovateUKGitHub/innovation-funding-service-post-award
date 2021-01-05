import { ContentBase } from "@content/contentBase";

export class PcrSpendProfileLabels extends ContentBase {
  constructor(parent: ContentBase, protected competitionType?: string) {
    super(parent, "pcr-spend-profile-labels", competitionType);
  }

  public readonly description = this.getContent("description");
  public readonly cost = this.getContent("cost");
  public readonly totalCosts = (costCategoryName: string) => this.getContent("total-costs", { costCategoryName });
  public readonly labour = {
    role: this.getContent("labour.role"),
    grossCost: this.getContent("labour.gross-cost"),
    rate: this.getContent("labour.rate"),
    rateHint: this.getContent("labour.rate-hint"),
    daysOnProject: this.getContent("labour.days-spent-on-project"),
    totalCost: this.getContent("labour.total-cost"),
    totalCostHint: this.getContent("labour.total-cost-hint"),
  };
  public readonly overheads = {
    totalCost: this.getContent("overheads.total-cost"),
    calculatedCost: this.getContent("overheads.calculated-cost"),
    uploadDocumentsLink: this.getContent("overheads.link-documents-upload"),
  };
  public readonly materials = {
    item: this.getContent("materials.item"),
    quantity: this.getContent("materials.quantity"),
    costPerItem: this.getContent("materials.cost-per-item"),
    totalCost: this.getContent("materials.total-cost"),
  };
  public readonly subcontracting = {
    subcontractorName: this.getContent("subcontracting.subcontractor-name"),
    subcontractorCountry: this.getContent("subcontracting.subcontractor-country"),
    subcontractorRoleAndDescription: this.getContent("subcontracting.subcontractor-role-and-description"),
    cost: this.getContent("subcontracting.cost"),
  };
  public readonly capitalUsage = {
    description: this.getContent("capital-usage.description"),
    type: this.getContent("capital-usage.type"),
    depreciationPeriod: this.getContent("capital-usage.depreciation-period"),
    netPresentValue: this.getContent("capital-usage.net-present-value"),
    netPresentValueHint: this.getContent("capital-usage.net-present-value-hint"),
    residualValue: this.getContent("capital-usage.residual-value"),
    utilisation: this.getContent("capital-usage.utilisation"),
    netCost: this.getContent("capital-usage.net-cost"),
  };
  public readonly travelAndSubs = {
    description: this.getContent("travel-and-subs.description"),
    numberOfTimes: this.getContent("travel-and-subs.number-of-times"),
    costOfEach: this.getContent("travel-and-subs.cost-of-each"),
    totalCost: this.getContent("travel-and-subs.total-cost"),
  };
  public readonly otherCosts = {
    description: this.getContent("other-costs.description"),
    totalCost: this.getContent("other-costs.total-cost"),
  };
}
