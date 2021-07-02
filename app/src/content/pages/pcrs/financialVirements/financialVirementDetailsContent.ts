import { FinancialVirementLabels } from "@content/labels/financialVirementLabels";
import { Content } from "@content/content";
import { ContentPageBase } from "@content/contentPageBase";

export class FinancialVirementDetailsContent extends ContentPageBase {
  constructor(content: Content, competitionType?: string) {
    super(content, "financial-virement-details", competitionType);
  }

  public readonly labels = new FinancialVirementLabels(this, this.competitionType);
}
