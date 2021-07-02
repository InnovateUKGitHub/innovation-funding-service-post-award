import { PCRAddPartnerLabels } from "@content/labels/pcrAddPartnerLabels";
import { Content } from "@content/content";
import { ContentPageBase } from "@content/contentPageBase";
import { PCRItem } from "../pcrItem";

export class PCRAddPartnerSpendProfileContent extends ContentPageBase {
  constructor(content: Content, competitionType?: string) {
    super(content, "pcr-add-partner-spend-profile", competitionType);
  }

  public readonly pcrItem = new PCRItem(this, this.competitionType);
  public readonly labels = new PCRAddPartnerLabels(this, this.competitionType);

  public readonly returnToSummaryNoSave = this.getContent("return-to-summary-no-save-button");
  public readonly categoryHeading = this.getContent("category-heading");
  public readonly totalCosts = this.getContent("total-costs");
  public readonly viewLabel = this.getContent("label-view");
  public readonly editLabel = this.getContent("label-edit");
  public readonly costHeading = this.getContent("cost-heading");
}
