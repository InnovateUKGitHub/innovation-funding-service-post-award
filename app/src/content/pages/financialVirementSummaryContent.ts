import { ContentPageBase } from "../contentPageBase";
import { Content } from "../content";
import { FinancialVirementLabels } from "@content/labels/financialVirementLabels";

export class FinancialVirementSummaryContent extends ContentPageBase {
  constructor(content: Content) {
    super(content, "financial-virement-summary");
  }

  public readonly labels = new FinancialVirementLabels(this);
}
