import { ContentPageBase } from "@content/contentPageBase";
import { ProjectContactLabels } from "@content/labels/projectContactLabels";
import { Content } from "@content/content";

export class PartnerDetailsEditContent extends ContentPageBase {
  constructor(content: Content, protected competitionType?: string) {
    super(content, "partner-details-edit", competitionType);
  }

  public readonly contactLabels = new ProjectContactLabels(this, this.competitionType);

  public readonly postcodeSectionTitle = this.getContent("section-title-postcode");
  public readonly currentPostcodeLabel = this.getContent("label-current-postcode");
  public readonly newPostcodeLabel = this.getContent("label-new-postcode");
  public readonly newPostcodeHint = this.getContent("hint-new-postcode");
  public readonly buttonSaveAndReturnPartnerDetails = this.getContent("save-and-return-partner-details-button");
  public readonly backToPartnerInfo = this.getContent("back-to-partner-info");
}
