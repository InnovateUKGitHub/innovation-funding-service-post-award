import { ContentPageBase } from "../../contentPageBase";
import { Content } from "../../content";
import { ClaimMessages } from "@content/messages/claimMessages";
import { ClaimsLabels } from "@content/labels/claimsLabels";

export class ClaimPrepareContent extends ContentPageBase {
  constructor(private readonly content: Content) {
    super(content, "claim-prepare");
  }
  public readonly messages = new ClaimMessages(this);
  public readonly labels = new ClaimsLabels(this);
  public readonly backLink = () => this.getContent("back-link");
  public readonly saveAndReturnButton = () => this.getContent("button-save-and-return");
  public readonly saveAndContinueButton = () => this.getContent("button-save-and-continue");
}
