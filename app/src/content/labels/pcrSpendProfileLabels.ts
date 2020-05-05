import { ContentBase } from "@content/contentBase";

export class PcrSpendProfileLabels extends ContentBase {
  constructor(parent: ContentBase) {
    super(parent, "pcr-spend-profile-labels");
  }

  public readonly description = () => this.getContent("description");
  public readonly cost = () => this.getContent("cost");
  public readonly totalCosts = (costCategoryName: string) => this.getContent("total-costs", {costCategoryName});
  public readonly labour = {
    role: () => this.getContent("labour.role"),
    grossCost: () => this.getContent("labour.gross-cost"),
    rate: () => this.getContent("labour.rate"),
    rateHint: () => this.getContent("labour.rate-hint"),
    daysOnProject: () => this.getContent("labour.days-spent-on-project"),
    totalCost: () => this.getContent("labour.total-cost"),
    totalCostHint: () => this.getContent("labour.total-cost-hint"),
  };
}
