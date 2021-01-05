import { ContentPageBase } from "../contentPageBase";
import { Content } from "../content";

export class ClaimWindowContent extends ContentPageBase {
  constructor(content: Content, protected competitionType?: string) {
    super(content, "claimWindow", competitionType);
  }

  public readonly nextClaimPeriod = this.getContent("components.claimWindow.nextClaimPeriod");
  public readonly begins = this.getContent("components.claimWindow.begins");
  public readonly end = this.getContent("components.claimWindow.end");
  public readonly daysOutstanding = this.getContent("components.claimWindow.daysOutstanding");
  public readonly deadline = this.getContent("components.claimWindow.deadline");
  public readonly daysOverdue = this.getContent("components.claimWindow.daysOverdue");
}
