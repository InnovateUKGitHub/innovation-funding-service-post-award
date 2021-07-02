import { Content } from "@content/content";
import { ContentPageBase } from "@content/contentPageBase";
import { ProjectLabels } from "@content/labels/projectLabels";
import { ProjectMessages } from "@content/messages/projectMessages";

export class FinanceSummaryContent extends ContentPageBase {
  constructor(content: Content, competitionType?: string) {
    super(content, "finance-summary", competitionType);
  }

  public readonly projectMessages = new ProjectMessages(this, this.competitionType);
  public readonly projectLabels = new ProjectLabels(this, this.competitionType);

  public readonly totalsFooterLabel = this.getContent("totalsFooter");
  public readonly backToProjectOverview = this.getContent("bact-to-project-overview");
  public readonly partnerFinanceDetailsTitle = this.getContent("partner-finance-details-title");
  public readonly accountantsReportTitle = this.getContent("accountants-report-title");
}
