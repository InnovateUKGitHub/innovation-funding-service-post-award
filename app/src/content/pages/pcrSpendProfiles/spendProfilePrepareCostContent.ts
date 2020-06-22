import { ContentPageBase } from "@content/contentPageBase";
import { Content } from "@content/content";
import { PcrSpendProfileLabels } from "@content/labels/pcrSpendProfileLabels";
import { PcrSpendProfileMessages } from "@content/messages/pcrSpendProfileMessages";

export class PcrSpendProfilePrepareCostContent extends ContentPageBase {

  constructor(content: Content) {
    super(content, "pcr-spend-profile-prepare-cost");
  }

  public readonly labels = new PcrSpendProfileLabels(this);
  public readonly messages = new PcrSpendProfileMessages(this);
  public readonly costSectionTitle = (costCategoryName: string) => this.getContent("section-title-cost", {costCategoryName});
  public readonly guidanceTitle = (costCategoryName: string) => this.getContent("guidance-title", {costCategoryName});
  public readonly backLink = (costCategoryName: string) => this.getContent("back-link", {costCategoryName});
  public readonly submitButton = (costCategoryName: string) => this.getContent("button-submit", {costCategoryName});
}
