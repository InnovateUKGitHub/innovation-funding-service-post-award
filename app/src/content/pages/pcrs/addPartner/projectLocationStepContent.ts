import { ContentPageBase } from "../../../contentPageBase";
import { Content } from "../../../content";
import { PCRItem } from "../pcrItem";
import { PCRAddPartnerLabels } from "@content/labels/pcrAddPartnerLabels";

export class PCRAddPartnerProjectLocationContent extends ContentPageBase {
  constructor(private readonly content: Content) {
    super(content, "pcr-add-partner-project-location");
  }

  public readonly pcrItem = new PCRItem(this);
  public readonly labels = new PCRAddPartnerLabels(this);

  public readonly projectLocationGuidance = () => this.getContent("project-location-guidance");
  public readonly postcodeGuidance = () => this.getContent("postcode-guidance");
}
