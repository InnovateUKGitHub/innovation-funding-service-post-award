import { ContentPageBase } from "@content/contentPageBase";
import { Content } from "@content/content";
import { PcrSpendProfileLabels } from "@content/labels/pcrSpendProfileLabels";

export class PcrSpendProfilePrepareCostContent extends ContentPageBase {

  constructor(content: Content) {
    super(content, "pcr-spend-profile-prepare-cost");
  }

  public readonly labels = new PcrSpendProfileLabels(this);
  public readonly costSectionTitle = (costCategoryName: string) => this.getContent("section-title-cost", {costCategoryName});
  public readonly backLink = (costCategoryName: string) => this.getContent("back-link", {costCategoryName});
  public readonly submitButton = (costCategoryName: string) => this.getContent("button-submit", {costCategoryName});
}
