import { Content } from "@content/content";
import { ContentPageBase } from "@content/contentPageBase";

export class ProjectSetupSpendProfileContent extends ContentPageBase {
  constructor(content: Content, competitionType?: string) {
    super(content, "project-setup-spend-profile", competitionType);
  }

  public readonly guidanceMessage = this.getContent("guidance-message");
  public readonly submitButton = this.getContent("submit-button");
  public readonly backLink = this.getContent("back-link");
  public readonly readyToSubmitMessage = this.getContent("ready_to_submit-message");
  public readonly markAsComplete = this.getContent("mark-as-complete");
  public readonly spendProfileUpdatedMessage = this.getContent("spend-profile-updated-message");
}
