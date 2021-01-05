import { ContentPageBase } from "../../../contentPageBase";
import { Content } from "../../../content";
import { FinancialVirementLabels } from "@content/labels/financialVirementLabels";

export class FinancialVirementEditPartnerLevelContent extends ContentPageBase {
  constructor(content: Content, protected competitionType?: string) {
    super(content, "financial-virement-edit-partner-level", competitionType);
  }

  public readonly saveButton = this.getContent("save-button");

  public readonly remainingGrantInfo = this.getContent("remaining-grant-info");

  public readonly labels = new FinancialVirementLabels(this, this.competitionType);
}
