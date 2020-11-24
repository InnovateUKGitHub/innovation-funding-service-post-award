import { ContentPageBase } from "../contentPageBase";
import { Content } from "../content";
import { ProjectDto } from "@framework/dtos";

export class ClaimDetailsLinkContent extends ContentPageBase {
  constructor(content: Content, protected project: ProjectDto | null | undefined) {
    super(content, "claimDetailsLinkContent", project);
  }

  public readonly editClaimText = this.getContent("components.claimDetailsLinkContent.editClaim");
  public readonly reviewClaimText = this.getContent("components.claimDetailsLinkContent.reviewClaim");
  public readonly viewClaimText = this.getContent("components.claimDetailsLinkContent.viewClaim");

}
