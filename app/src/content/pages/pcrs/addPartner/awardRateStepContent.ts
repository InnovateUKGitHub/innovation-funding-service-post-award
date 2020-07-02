import { ContentPageBase } from "../../../contentPageBase";
import { Content } from "../../../content";
import { PCRItem } from "../pcrItem";
import { PCRAddPartnerLabels } from "@content/labels/pcrAddPartnerLabels";

export class PCRAddPartnerAwardRateContent extends ContentPageBase {
  constructor(private readonly content: Content) {
    super(content, "pcr-add-partner-award-rate");
  }

  public readonly pcrItem = new PCRItem(this);
  public readonly labels = new PCRAddPartnerLabels(this);

  public readonly formSectionTitle = () => this.getContent("form-section-title");
  public readonly guidance = () => this.getContent("guidance", {markdown: true});
}
