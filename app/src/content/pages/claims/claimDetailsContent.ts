import { ContentPageBase } from "../../contentPageBase";
import { Content } from "../../content";
import { ClaimMessages } from "@content/messages/claimMessages";
import { ClaimsLabels } from "@content/labels/claimsLabels";
import { ProjectDto } from "@framework/dtos";

export class ClaimDetailsContent extends ContentPageBase {
  constructor(private readonly content: Content, protected project: ProjectDto | null | undefined) {
    super(content, "claim-details", project);
  }
  public readonly messages = new ClaimMessages(this, this.project);
  public readonly labels = new ClaimsLabels(this, this.project);
  public readonly backLink = this.getContent("back-link");
  public readonly commentsSectionTitle = this.getContent("section-title-comments");
  public readonly costsAndGrantSummaryTitle = this.getContent("costs-and-grant-summary-title");
}
