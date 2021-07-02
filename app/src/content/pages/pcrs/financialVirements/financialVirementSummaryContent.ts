import { Content } from "@content/content";
import { ContentPageBase } from "@content/contentPageBase";
import { FinancialVirementLabels } from "@content/labels/financialVirementLabels";

export class FinancialVirementSummaryContent extends ContentPageBase {
  constructor(content: Content, competitionType?: string) {
    super(content, "financial-virement-summary", competitionType);
  }

  public readonly labels = new FinancialVirementLabels(this, this.competitionType);
  public readonly grantAdvice = this.getContent("grant-advice");

  public readonly availableGrantMessage = (grantDifference: string) =>
    this.getContent("available-grant-message", { grantDifference });

  public readonly unavailableGrantMessage = (x: Record<"grantDifference" | "totalOriginalGrant", string>) => {
    return this.getContent("unavailable-grant-message", { markdown: true, ...x });
  };

  public readonly changeGrantLink = this.getContent("link-change-grant");
  public readonly grantValueMovingOverHeading = this.getContent("heading-year-end-grant-value", { markdown: true });
}
