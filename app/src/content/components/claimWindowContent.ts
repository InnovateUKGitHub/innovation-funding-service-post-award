import { ContentPageBase } from "../contentPageBase";
import { Content } from "../content";
import { ProjectDto } from "@framework/dtos";

export class ClaimWindowContent extends ContentPageBase {
  constructor(content: Content, protected project: ProjectDto | null | undefined) {
    super(content, "claimWindow", project);
  }

  public readonly nextClaimPeriod = this.getContent("components.claimWindow.nextClaimPeriod");
  public readonly begins = this.getContent("components.claimWindow.begins");
  public readonly end = this.getContent("components.claimWindow.end");
  public readonly daysOutstanding = this.getContent("components.claimWindow.daysOutstanding");
  public readonly deadline = this.getContent("components.claimWindow.deadline");
  public readonly daysOverdue = this.getContent("components.claimWindow.daysOverdue");
}
