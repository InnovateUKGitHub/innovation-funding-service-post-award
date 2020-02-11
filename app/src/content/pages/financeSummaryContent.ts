import { ContentPageBase } from "../contentPageBase";
import { Content } from "../content";
import { ProjectMessages } from "../messages/projectMessages";
import { ProjectLabels } from "@content/labels/projectLabels";

export class FinanceSummaryContent extends ContentPageBase {
  constructor(content: Content) {
    super(content, "finance-summary");
  }

  public projectMessages = new ProjectMessages(this);
  public projectLabels = new ProjectLabels(this);

  public totalsFooterLabel = () => this.getContent("totalsFooter");
}
