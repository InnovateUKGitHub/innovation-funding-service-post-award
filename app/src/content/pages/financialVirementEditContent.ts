import { ContentPageBase } from "../contentPageBase";
import { Content } from "../content";
import { FinancialVirementLabels } from "@content/labels/financialVirementLabels";

export class FinancialVirementEditContent extends ContentPageBase {
  constructor(content: Content) {
    super(content, "financial-virement-edit");
  }

  public readonly labels = new FinancialVirementLabels(this);

  public readonly summaryTitle = () => this.getContent("summary-title");
  public readonly saveButton = () => this.getContent("save-button");
}
