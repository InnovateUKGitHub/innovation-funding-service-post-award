import {ContentPageBase} from "@content/contentPageBase";
import {Content} from "@content/content";
import {PcrSpendProfileLabels} from "@content/labels/pcrSpendProfileLabels";
import {PcrSpendProfileMessages} from "@content/messages/pcrSpendProfileMessages";

export class PcrSpendProfileCostsSummaryContent extends ContentPageBase {

  constructor(content: Content) {
    super(content, "pcr-spend-profile-costs-summary");
  }

  public readonly labels = () => new PcrSpendProfileLabels(this);
  public readonly messages = () => new PcrSpendProfileMessages(this);
  public readonly costsSectionTitle = (costCategoryName: string) => this.getContent("section-title-costs", {costCategoryName});
  public readonly guidanceTitle = (costCategoryName: string) => this.getContent("guidance-title", {costCategoryName});
  public readonly backLink = () => this.getContent("back-link");
  public readonly submitButton = () => this.getContent("button-submit");
  public readonly addCostButton = () => this.getContent("button-add-cost");
  public readonly editCostButton = () => this.getContent("button-edit-cost");
  public readonly removeCostButton = () => this.getContent("button-remove-cost");
}
