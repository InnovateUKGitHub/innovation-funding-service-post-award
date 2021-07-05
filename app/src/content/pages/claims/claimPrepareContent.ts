import { ClaimMessages } from "@content/messages/claimMessages";
import { ClaimsLabels } from "@content/labels/claimsLabels";
import { Content } from "@content/content";
import { ContentPageBase } from "@content/contentPageBase";

export class ClaimPrepareContent extends ContentPageBase {
  constructor(content: Content, competitionType?: string) {
    super(content, "claim-prepare", competitionType);
  }
  public readonly messages = new ClaimMessages(this, this.competitionType);
  public readonly labels = new ClaimsLabels(this, this.competitionType);
  public readonly backLink = this.getContent("back-link");
  public readonly saveAndReturnButton = this.getContent("button-save-and-return");
  public readonly saveAndContinueButton = this.getContent("button-save-and-continue");
}
