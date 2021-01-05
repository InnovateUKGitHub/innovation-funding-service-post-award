import { ContentPageBase } from "../../../contentPageBase";
import { Content } from "../../../content";
import { FinancialVirementLabels } from "@content/labels/financialVirementLabels";

export class FinancialVirementSummaryContent extends ContentPageBase {
  constructor(content: Content, protected competitionType?: string) {
    super(content, "financial-virement-summary", competitionType);
  }

  public readonly labels = new FinancialVirementLabels(this, this.competitionType);

  public readonly guidance = this.getContent("guidance");
  public readonly changeGrantLink = this.getContent("link-change-grant");
  public readonly grantValueMovingOverHeading = this.getContent("heading-year-end-grant-value", { markdown: true });
}
