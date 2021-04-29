import { ContentPageBase } from "@content/contentPageBase";
import { Content } from "../../../content";

export class ProjectSetupPartnerPostcodeContent extends ContentPageBase {
  constructor(content: Content, protected competitionType?: string) {
    super(content, "project-setup-postcode-details", competitionType);
  }
  public readonly backLink = this.getContent("back-link");
  public readonly saveAndReturn = this.getContent("save-and-return");
}
