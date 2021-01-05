import { ContentPageBase } from "../../../contentPageBase";
import { Content } from "../../../content";
import { FinancialVirementLabels } from "@content/labels/financialVirementLabels";

export class FinancialVirementDetailsContent extends ContentPageBase {
  constructor(content: Content, protected competitionType?: string) {
    super(content, "financial-virement-details", competitionType);
  }

  public readonly labels = new FinancialVirementLabels(this, this.competitionType);
}
