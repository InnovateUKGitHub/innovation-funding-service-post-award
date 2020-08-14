import { ContentPageBase } from "../contentPageBase";
import { Content } from "../content";
import { ProjectMessages } from "../messages/projectMessages";
import { ProjectLabels } from "@content/labels/projectLabels";
import { ProjectDto } from "@framework/dtos";

export class FinanceSummaryContent extends ContentPageBase {
  constructor(content: Content, protected project: ProjectDto | null | undefined) {
    super(content, "finance-summary", project);
  }

  public readonly projectMessages = new ProjectMessages(this, this.project);
  public readonly projectLabels = new ProjectLabels(this, this.project);

  public readonly totalsFooterLabel = () => this.getContent("totalsFooter");
}
