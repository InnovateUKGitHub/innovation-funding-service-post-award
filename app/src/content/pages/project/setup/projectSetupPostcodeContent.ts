import { Content } from "@content/content";
import { ContentPageBase } from "@content/contentPageBase";

export class ProjectSetupPartnerPostcodeContent extends ContentPageBase {
  constructor(content: Content, competitionType?: string) {
    super(content, "project-setup-postcode-details", competitionType);
  }
  public readonly backLink = this.getContent("back-link");
  public readonly saveAndReturn = this.getContent("save-and-return");
}
