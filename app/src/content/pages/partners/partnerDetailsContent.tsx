import { ContentPageBase } from "@content/contentPageBase";
import { ProjectContactLabels } from "@content/labels/projectContactLabels";
import { Content } from "@content/content";

export class PartnerDetailsContent extends ContentPageBase {
  constructor(content: Content) {
    super(content, "partner-details");
  }

  public readonly contactLabels = new ProjectContactLabels(this);
}
