import { ContentPageBase } from "../contentPageBase";
import { Content } from "../content";
import { FinancialVirementLabels } from "@content/labels/financialVirementLabels";

export class FinancialVirementDetailsContent extends ContentPageBase {
  constructor(content: Content) {
    super(content, "financial-virement-details");
  }

  public readonly labels = new FinancialVirementLabels(this);
}
