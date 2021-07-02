import { ContentPageBase } from "@content/contentPageBase";
import { ProjectMessages } from "@content/messages/projectMessages";
import { TaskListContent } from "@content/components/taskListContent";
import { Content } from "@content/content";

export class ProjectSetupContent extends ContentPageBase {
  constructor(content: Content, competitionType?: string) {
    super(content, "project-setup", competitionType);
  }

  public readonly projectMessages = new ProjectMessages(this, this.competitionType);
  public readonly backLink = this.getContent("back-link");
  public readonly taskList = new TaskListContent(this, this.competitionType);
  public readonly setSpendProfile = this.getContent("set-spend-profile");
  public readonly provideBankDetails = this.getContent("provide-bank-details");
  public readonly providePostcode = this.getContent("provide-project-location");
  public readonly complete = this.getContent("complete");
}
