import { ContentPageBase } from "../../../contentPageBase";
import { Content } from "../../../content";
import { PCRItem } from "../pcrItem";
import { PCRAddPartnerLabels } from "@content/labels/pcrAddPartnerLabels";

export class PCRAddPartnerOtherFundingContent extends ContentPageBase {
  constructor(private readonly content: Content, protected competitionType?: string) {
    super(content, "pcr-add-partner-other-funding", competitionType);
  }

  public readonly pcrItem = new PCRItem(this, this.competitionType);
  public readonly labels = new PCRAddPartnerLabels(this, this.competitionType);

  public readonly formSectionTitle = this.getContent("form-section-title");
  public readonly guidance = this.getContent("guidance", { markdown: true });
  public readonly questionLabel = this.getContent("label-other-sources-question");
}
