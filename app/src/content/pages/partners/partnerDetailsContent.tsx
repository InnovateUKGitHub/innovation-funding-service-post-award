import { ContentPageBase } from "@content/contentPageBase";
import { ProjectContactLabels } from "@content/labels/projectContactLabels";
import { Content } from "@content/content";

export class PartnerDetailsContent extends ContentPageBase {
  constructor(content: Content, protected competitionType?: string) {
    super(content, "partner-details", competitionType);
  }

  public readonly contactLabels = new ProjectContactLabels(this, this.competitionType);
  public readonly backToProjectDetails = this.getContent("backToProjectDetails");
  public readonly editLink = this.getContent("editLink");
}
