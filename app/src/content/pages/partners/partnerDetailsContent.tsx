import { ContentPageBase } from "@content/contentPageBase";
import { ProjectContactLabels } from "@content/labels/projectContactLabels";
import { Content } from "@content/content";
import { ProjectDto } from "@framework/dtos";

export class PartnerDetailsContent extends ContentPageBase {
  constructor(content: Content, protected project: ProjectDto | null | undefined) {
    super(content, "partner-details", project);
  }

  public readonly contactLabels = new ProjectContactLabels(this, this.project);
  public readonly backToProjectDetails = this.getContent("backToProjectDetails");
  public readonly editLink = this.getContent("editLink");

}
