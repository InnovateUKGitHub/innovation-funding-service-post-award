import { ContentPageBase } from "@content/contentPageBase";
import { ProjectContactLabels } from "@content/labels/projectContactLabels";
import { Content } from "@content/content";

export class PartnerDetailsEditContent extends ContentPageBase {
  constructor(content: Content) {
    super(content, "partner-details-edit");
  }

  public readonly contactLabels = new ProjectContactLabels(this);

  public readonly buttonSaveAndReturnPartnerDetails = () => this.getContent("save-and-return-partner-details-button");
}
