import { ContentPageBase } from "../../contentPageBase";
import { Content } from "../../content";
import { ClaimMessages } from "@content/messages/claimMessages";
import { ProjectDto } from "@framework/dtos";

export class ClaimForecastContent extends ContentPageBase {
  constructor(private readonly content: Content, protected project: ProjectDto | null | undefined) {
    super(content, "claim-forecast", project);
  }
  public readonly messages = new ClaimMessages(this, this.project);
  public readonly backLink = this.getContent("back-link");
  public readonly saveAndReturnButton = this.getContent("button-save-and-return");
  public readonly continueToSummaryButton = this.getContent("button-continue-to-summary");
  public readonly overheadsCosts = this.getContent("overheads-costs");
}
