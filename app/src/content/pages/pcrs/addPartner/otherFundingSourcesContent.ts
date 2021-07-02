import { PCRAddPartnerLabels } from "@content/labels/pcrAddPartnerLabels";
import { Content } from "@content/content";
import { ContentPageBase } from "@content/contentPageBase";
import { PCRItem } from "../pcrItem";

export class PCRAddPartnerOtherFundingSourcesContent extends ContentPageBase {
  constructor(content: Content, competitionType?: string) {
    super(content, "pcr-add-partner-other-funding-sources", competitionType);
  }

  public readonly pcrItem = new PCRItem(this, this.competitionType);
  public readonly labels = new PCRAddPartnerLabels(this, this.competitionType);

  public readonly formSectionTitle = this.getContent("form-section-title");
  public readonly guidance = this.getContent("guidance", { markdown: true });
  public readonly columnHeaderDescription = this.getContent("column-header-description");
  public readonly columnHeaderDate = this.getContent("column-header-date");
  public readonly columnHeaderValue = this.getContent("column-header-value");
  public readonly footerLabelTotal = this.getContent("footer-label-total");
  public readonly removeButton = this.getContent("button-remove");
  public readonly addButton = this.getContent("button-add");
}
