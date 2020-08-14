import { ContentPageBase } from "@content/contentPageBase";
import { ProjectContactLabels } from "@content/labels/projectContactLabels";
import { Content } from "@content/content";
import { ProjectDto } from "@framework/dtos";

export class PartnerDetailsEditContent extends ContentPageBase {
  constructor(content: Content, protected project: ProjectDto | null | undefined) {
    super(content, "partner-details-edit", project);
  }

  public readonly contactLabels = new ProjectContactLabels(this, this.project);

  public readonly postcodeSectionTitle = () => this.getContent("section-title-postcode");
  public readonly currentPostcodeLabel = () => this.getContent("label-current-postcode");
  public readonly newPostcodeLabel = () => this.getContent("label-new-postcode");
  public readonly newPostcodeHint = () => this.getContent("hint-new-postcode");
  public readonly buttonSaveAndReturnPartnerDetails = () => this.getContent("save-and-return-partner-details-button");
}
