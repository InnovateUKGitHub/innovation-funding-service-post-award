import { PCRAddPartnerLabels } from "@content/labels/pcrAddPartnerLabels";
import { Content } from "@content/content";
import { ContentPageBase } from "@content/contentPageBase";
import { PCRItem } from "../pcrItem";

export class PCRAddPartnerAwardRateContent extends ContentPageBase {
  constructor(content: Content, competitionType?: string) {
    super(content, "pcr-add-partner-award-rate", competitionType);
  }

  public readonly pcrItem = new PCRItem(this, this.competitionType);
  public readonly labels = new PCRAddPartnerLabels(this, this.competitionType);

  public readonly formSectionTitle = this.getContent("form-section-title");
  public readonly guidance = this.getContent("guidance", { markdown: true });
}
