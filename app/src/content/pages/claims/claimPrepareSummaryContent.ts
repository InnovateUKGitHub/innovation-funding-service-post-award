import { ContentPageBase } from "../../contentPageBase";
import { Content } from "../../content";
import { ClaimMessages } from "@content/messages/claimMessages";
import { ClaimsLabels } from "@content/labels/claimsLabels";
import { ProjectDto } from "@framework/dtos";

export class ClaimPrepareSummaryContent extends ContentPageBase {
  constructor(private readonly content: Content, protected project: ProjectDto | null | undefined) {
    super(content, "claim-prepare-summary", project);
  }
  public readonly messages = new ClaimMessages(this, this.project);
  public readonly labels = new ClaimsLabels(this, this.project);
}
