import { ContentPageBase } from "../contentPageBase";
import { Content } from "../content";
import { FinancialVirementLabels } from "@content/labels/financialVirementLabels";

export class FinancialVirementEditPartnerLevelContent extends ContentPageBase {
  constructor(content: Content) {
    super(content, "financial-virement-edit-partner-level");
  }

  public readonly saveButton = () => this.getContent("save-button");

  public readonly remainingGrantInfo = () => this.getContent("remaining-grant-info");

  public readonly labels = new FinancialVirementLabels(this);
}
