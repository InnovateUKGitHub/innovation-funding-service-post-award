import { ContentPageBase } from "@content/contentPageBase";
import { ProjectContactLabels } from "@content/labels/projectContactLabels";
import { Content } from "@content/content";

export class PartnerDetailsEditContent extends ContentPageBase {
  constructor(content: Content, protected competitionType?: string) {
    super(content, "partner-details-edit", competitionType);
  }

  public readonly contactLabels = new ProjectContactLabels(this, this.competitionType);

  public readonly backToPartnerInfo = this.getContent("back-to-partner-info");
  public readonly buttonSaveAndReturnPartnerDetails = this.getContent("save-and-return-partner-details-button");
}
