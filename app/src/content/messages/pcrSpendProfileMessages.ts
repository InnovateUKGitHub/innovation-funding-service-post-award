import { ContentBase } from "@content/contentBase";
import { CostCategoryItem } from "@framework/types";

export class PcrSpendProfileMessages extends ContentBase {
  constructor(parent: ContentBase, competitionType?: string) {
    super(parent, "spend-profile-messages", competitionType);
  }

  public readonly costGuidance = (costCategory: CostCategoryItem) => {
    return this.getContent(costCategory.guidanceMessageKey, { markdown: true });
  };
  public readonly overHeadsCalculatedGuidance = this.getContent("calculated-guidance-overheads");
}
