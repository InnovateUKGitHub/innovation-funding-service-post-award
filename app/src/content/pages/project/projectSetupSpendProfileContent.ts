import { ContentPageBase } from "@content/contentPageBase";
import { Content } from "../../content";

export class ProjectSetupSpendProfileContent extends ContentPageBase {
  constructor(content: Content) {
    super(content, "project-setup-spend-profile");
  }

  public readonly guidanceMessage = () => this.getContent("guidance-message");
  public readonly submitButton = () => this.getContent("submit-button");
  public readonly backLink = () => this.getContent("back-link");
}
