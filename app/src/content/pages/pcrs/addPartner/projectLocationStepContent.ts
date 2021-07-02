import { PCRAddPartnerLabels } from "@content/labels/pcrAddPartnerLabels";
import { Content } from "@content/content";
import { ContentPageBase } from "@content/contentPageBase";
import { PCRItem } from "../pcrItem";

export class PCRAddPartnerProjectLocationContent extends ContentPageBase {
  constructor(content: Content, competitionType?: string) {
    super(content, "pcr-add-partner-project-location", competitionType);
  }

  public readonly pcrItem = new PCRItem(this, this.competitionType);
  public readonly labels = new PCRAddPartnerLabels(this, this.competitionType);

  public readonly projectLocationGuidance = this.getContent("project-location-guidance");
  public readonly postcodeGuidance = this.getContent("postcode-guidance");
}
