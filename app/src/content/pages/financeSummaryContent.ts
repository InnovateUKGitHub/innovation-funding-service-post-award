import { ContentPageBase } from "../contentPageBase";
import { Content } from "../content";
import { ProjectMessages } from "../messages/projectMessages";
import { ProjectLabels } from "@content/labels/projectLabels";

export class FinanceSummaryContent extends ContentPageBase {
  constructor(content: Content) {
    super(content, "finance-summary");
  }

  public readonly projectMessages = new ProjectMessages(this);
  public readonly projectLabels = new ProjectLabels(this);

  public readonly totalsFooterLabel = () => this.getContent("totalsFooter");
}
