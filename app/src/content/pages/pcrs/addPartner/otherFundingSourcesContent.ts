import { ContentPageBase } from "../../../contentPageBase";
import { Content } from "../../../content";
import { PCRItem } from "../pcrItem";
import { PCRAddPartnerLabels } from "@content/labels/pcrAddPartnerLabels";

export class PCRAddPartnerOtherFundingSourcesContent extends ContentPageBase {
  constructor(private readonly content: Content) {
    super(content, "pcr-add-partner-other-funding-sources");
  }

  public readonly pcrItem = new PCRItem(this);
  public readonly labels = new PCRAddPartnerLabels(this);

  public readonly formSectionTitle = () => this.getContent("form-section-title");
  public readonly guidance = () => this.getContent("guidance", {markdown: true});
  public readonly columnHeaderDescription = () => this.getContent("column-header-description");
  public readonly columnHeaderDate = () => this.getContent("column-header-date");
  public readonly columnHeaderValue = () => this.getContent("column-header-value");
  public readonly footerLabelTotal = () => this.getContent("footer-label-total");
  public readonly removeButton = () => this.getContent("button-remove");
  public readonly addButton = () => this.getContent("button-add");
}
