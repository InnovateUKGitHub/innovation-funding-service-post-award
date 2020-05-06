import { ContentPageBase } from "@content/contentPageBase";
import { Content } from "@content/content";
import { CostCategoryType } from "@framework/entities";

export class PcrSpendProfileCostsSummaryContent extends ContentPageBase {

  constructor(content: Content) {
    super(content, "pcr-spend-profile-costs-summary");
  }

  public readonly costsSectionTitle = (costCategoryName: string) => this.getContent("section-title-costs", {costCategoryName});
  public readonly guidanceTitle = (costCategoryName: string) => this.getContent("guidance-title", {costCategoryName});
  public readonly backLink = () => this.getContent("back-link");
  public readonly submitButton = () => this.getContent("button-submit");
  public readonly addCostButton = () => this.getContent("button-add-cost");
  public readonly editCostButton = () => this.getContent("button-edit-cost");
  public readonly removeCostButton = () => this.getContent("button-remove-cost");
  public readonly descriptionLabel = () => this.getContent("label-description");
  public readonly costLabel = () => this.getContent("label-cost");
  public readonly guidance = (costCategory: CostCategoryType) => {
    switch (costCategory) {
      case CostCategoryType.Labour: return this.getContent(`guidance-labour`, {markdown: true});
      case CostCategoryType.Materials: return this.getContent(`guidance-materials`, {markdown: true});
      default: return this.getContent(`guidance-default`, {markdown: true});
    }
  }
}
