import { Content } from "@content/content";
import { ContentPageBase } from "@content/contentPageBase";

export class ClaimDetailsLinkContent extends ContentPageBase {
  constructor(content: Content, competitionType?: string) {
    super(content, "claimDetailsLinkContent", competitionType);
  }

  public readonly editClaimText = this.getContent("components.claimDetailsLinkContent.editClaim");
  public readonly reviewClaimText = this.getContent("components.claimDetailsLinkContent.reviewClaim");
  public readonly viewClaimText = this.getContent("components.claimDetailsLinkContent.viewClaim");
}
