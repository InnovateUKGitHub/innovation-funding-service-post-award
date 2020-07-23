import { ContentPageBase } from "@content/contentPageBase";
import { Content } from "../../content";
import { ProjectMessages } from "@content/messages/projectMessages";
import { TaskListContent } from "@content/components/taskListContent";

export class ProjectSetupContent extends ContentPageBase {
  constructor(content: Content) {
    super(content, "project-setup");
  }

  public readonly projectMessages = new ProjectMessages(this);
  public readonly backLink = () => this.getContent("back-link");
  public readonly taskList = () => new TaskListContent(this);
  public readonly setSpendProfile = () => this.getContent("set-spend-profile");
  public readonly provideBankDetails = () => this.getContent("provide-bank-details");
  public readonly complete = () => this.getContent("complete");
}
