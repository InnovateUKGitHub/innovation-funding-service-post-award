import { ContentPageBase } from "@content/contentPageBase";
import { Content } from "@content/content";
import { PcrSpendProfileLabels } from "@content/labels/pcrSpendProfileLabels";

export class PcrSpendProfileDeleteCostContent extends ContentPageBase {

  constructor(content: Content) {
    super(content, "pcr-spend-profile-delete-cost");
  }

  public readonly labels = new PcrSpendProfileLabels(this);
  public readonly costSectionTitle = (costCategoryName: string) => this.getContent("section-title-cost", {costCategoryName});
  public readonly backLink = (costCategoryName: string) => this.getContent("back-link", {costCategoryName});
  public readonly deleteButton = () => this.getContent("button-delete");
  public readonly deleteGuidance = () => this.getContent("guidance-delete");
}
