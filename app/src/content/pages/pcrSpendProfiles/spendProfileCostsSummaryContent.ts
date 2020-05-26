import {ContentPageBase} from "@content/contentPageBase";
import {Content} from "@content/content";
import {CostCategoryType} from "@framework/entities";
import {PcrSpendProfileLabels} from "@content/labels/pcrSpendProfileLabels";

export class PcrSpendProfileCostsSummaryContent extends ContentPageBase {

  constructor(content: Content) {
    super(content, "pcr-spend-profile-costs-summary");
  }

  public readonly labels = () => new PcrSpendProfileLabels(this);
  public readonly costsSectionTitle = (costCategoryName: string) => this.getContent("section-title-costs", {costCategoryName});
  public readonly guidanceTitle = (costCategoryName: string) => this.getContent("guidance-title", {costCategoryName});
  public readonly backLink = () => this.getContent("back-link");
  public readonly submitButton = () => this.getContent("button-submit");
  public readonly addCostButton = () => this.getContent("button-add-cost");
  public readonly editCostButton = () => this.getContent("button-edit-cost");
  public readonly removeCostButton = () => this.getContent("button-remove-cost");
  public readonly guidance = (costCategory: CostCategoryType) => {
    switch (costCategory) {
      case CostCategoryType.Labour: return this.getContent(`guidance-labour`, {markdown: true});
      case CostCategoryType.Materials: return this.getContent(`guidance-materials`, {markdown: true});
      case CostCategoryType.Subcontracting: return this.getContent(`guidance-subcontracting`, {markdown: true});
      case CostCategoryType.Capital_Usage: return this.getContent(`guidance-capital-usage`, {markdown: true});
      default: return this.getContent(`guidance-default`, {markdown: true});
    }
  }
}
