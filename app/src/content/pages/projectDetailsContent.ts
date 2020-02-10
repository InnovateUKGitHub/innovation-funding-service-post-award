import { ContentPageBase } from "@content/contentPageBase";
import { Content } from "../content";
import { ProjectMessages } from "@content/messages/projectMessages";
import { ProjectLabels } from "@content/labels/projectLabels";
import { ProjectContactLabels } from "@content/labels/projectContactLabels";

export class ProjectDetailsContent extends ContentPageBase {
  constructor(content: Content) {
    super(content, "project-details");
  }

  public projectMessages = new ProjectMessages(this);
  public projectLabels = new ProjectLabels(this);
  public contactLabels = new ProjectContactLabels(this);
}
