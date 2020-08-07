import { ContentPageBase } from "../../contentPageBase";
import { Content } from "../../content";
import { ClaimsLabels } from "@content/labels/claimsLabels";
import { ClaimMessages } from "@content/messages/claimMessages";
import { ProjectDto } from "@framework/dtos";

export class AllClaimsDashboardContent extends ContentPageBase {
  constructor(private readonly content: Content, protected project: ProjectDto | null | undefined) {
    super(content, "all-claims-dashboard", project);
  }
  public readonly messages = new ClaimMessages(this, this.project);
  public readonly labels = new ClaimsLabels(this, this.project);
}
