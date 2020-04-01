import { ContentPageBase } from "../../contentPageBase";
import { Content } from "../../content";
import { ClaimMessages } from "@content/messages/claimMessages";
import { ClaimsLabels } from "@content/labels/claimsLabels";

export class ClaimPrepareSummaryContent extends ContentPageBase {
  constructor(private content: Content) {
    super(content, "claim-prepare-summary");
  }
  public readonly messages = new ClaimMessages(this);
  public readonly labels = new ClaimsLabels(this);
}
