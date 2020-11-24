import { ContentPageBase } from "@content/contentPageBase";
import { Content } from "../../content";
import { ProjectMessages } from "@content/messages/projectMessages";
import { TaskListContent } from "@content/components/taskListContent";
import { ProjectDto } from "@framework/dtos";

export class ProjectSetupContent extends ContentPageBase {
  constructor(content: Content, protected project: ProjectDto | null | undefined) {
    super(content, "project-setup", project);
  }

  public readonly projectMessages = new ProjectMessages(this, this.project);
  public readonly backLink = this.getContent("back-link");
  public readonly taskList = new TaskListContent(this, this.project);
  public readonly setSpendProfile = this.getContent("set-spend-profile");
  public readonly provideBankDetails = this.getContent("provide-bank-details");
  public readonly complete = this.getContent("complete");
}
