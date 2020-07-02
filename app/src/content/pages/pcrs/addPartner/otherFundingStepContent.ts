import { ContentPageBase } from "../../../contentPageBase";
import { Content } from "../../../content";
import { PCRItem } from "../pcrItem";
import { PCRAddPartnerLabels } from "@content/labels/pcrAddPartnerLabels";

export class PCRAddPartnerOtherFundingContent extends ContentPageBase {
  constructor(private readonly content: Content) {
    super(content, "pcr-add-partner-other-funding");
  }

  public readonly pcrItem = new PCRItem(this);
  public readonly labels = new PCRAddPartnerLabels(this);

  public readonly formSectionTitle = () => this.getContent("form-section-title");
  public readonly guidance = () => this.getContent("guidance", {markdown: true});
  public readonly yesLabel = () => this.getContent("label-yes");
  public readonly noLabel = () => this.getContent("label-no");
}
