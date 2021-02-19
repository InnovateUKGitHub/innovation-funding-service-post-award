import { FinancialVirementLabels } from "@content/labels/financialVirementLabels";
import { ContentPageBase } from "../../../contentPageBase";
import { Content } from "../../../content";

export class FinancialVirementEditPartnerLevelContent extends ContentPageBase {
  constructor(content: Content, protected competitionType?: string) {
    super(content, "financial-virement-edit-partner-level", competitionType);
  }

  public readonly saveButton = this.getContent("save-button");

  public readonly remainingGrantInfo = {
    intro: this.getContent("remaining-grant-info.intro"),
    checkRules: this.getContent("remaining-grant-info.check-rules"),
    remainingGrant: this.getContent("remaining-grant-info.remaining-grant"),
    fundingLevel: this.getContent("remaining-grant-info.funding-level"),
  };

  public readonly labels = new FinancialVirementLabels(this, this.competitionType);
}
