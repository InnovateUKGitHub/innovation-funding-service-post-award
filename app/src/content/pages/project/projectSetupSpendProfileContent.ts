import { ContentPageBase } from "@content/contentPageBase";
import { Content } from "../../content";
import { ProjectDto } from "@framework/dtos";

export class ProjectSetupSpendProfileContent extends ContentPageBase {
  constructor(content: Content, protected project: ProjectDto | null | undefined) {
    super(content, "project-setup-spend-profile", project);
  }

  public readonly guidanceMessage = this.getContent("guidance-message");
  public readonly submitButton = this.getContent("submit-button");
  public readonly backLink = this.getContent("back-link");
  public readonly readyToSubmitMessage = this.getContent("ready_to_submit-message");
  public readonly markAsComplete = this.getContent("mark-as-complete");
  public readonly spendProfileUpdatedMessage = this.getContent("spend-profile-updated-message");
}
