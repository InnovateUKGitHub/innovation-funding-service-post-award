import { ContentPageBase } from "../../../contentPageBase";
import { Content } from "../../../content";
import { FinancialVirementLabels } from "@content/labels/financialVirementLabels";

export class FinancialVirementEditContent extends ContentPageBase {
  constructor(content: Content, protected competitionType?: string) {
    super(content, "financial-virement-edit", competitionType);
  }

  public readonly labels = new FinancialVirementLabels(this, this.competitionType);

  public readonly summaryTitle = this.getContent("summary-title");
  public readonly saveButton = this.getContent("save-button");

  public readonly editPageMessage = {
    intro: this.getContent("edit-page-message.intro"),
    virements: this.getContent("edit-page-message.virements"),
    requests: this.getContent("edit-page-message.requests"),
  };
}
