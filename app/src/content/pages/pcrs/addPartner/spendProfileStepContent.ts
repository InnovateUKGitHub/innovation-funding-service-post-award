import { ContentPageBase } from "../../../contentPageBase";
import { Content } from "../../../content";
import { PCRItem } from "../pcrItem";
import { PCRAddPartnerLabels } from "@content/labels/pcrAddPartnerLabels";

export class PCRAddPartnerSpendProfileContent extends ContentPageBase {
  constructor(private readonly content: Content, protected competitionType?: string) {
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
