import { PCRAddPartnerLabels } from "@content/labels/pcrAddPartnerLabels";
import { ContentPageBase } from "../../../contentPageBase";
import { Content } from "../../../content";
import { PCRItem } from "../pcrItem";

export class PCRAddPartnerOrganisationDetailsContent extends ContentPageBase {
  constructor(content: Content, competitionType?: string) {
    super(content, "pcr-add-partner-organisation-details", competitionType);
  }

  public readonly pcrItem = new PCRItem(this, this.competitionType);
  public readonly labels = new PCRAddPartnerLabels(this, this.competitionType);

  public readonly sectionTitle = this.getContent("section-title");
  public readonly guidance = this.getContent("guidance", { markdown: true });
}
