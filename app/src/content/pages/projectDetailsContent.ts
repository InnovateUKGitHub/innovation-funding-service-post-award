import { ContentPageBase } from "@content/contentPageBase";
import { Content } from "../content";
import { ProjectMessages } from "@content/messages/projectMessages";
import { ProjectLabels } from "@content/labels/projectLabels";
import { ProjectContactLabels } from "@content/labels/projectContactLabels";

export class ProjectDetailsContent extends ContentPageBase {
  constructor(content: Content) {
    super(content, "project-details");
  }

  public readonly projectMessages = new ProjectMessages(this);
  public readonly projectLabels = new ProjectLabels(this);
  public readonly contactLabels = new ProjectContactLabels(this);
}
