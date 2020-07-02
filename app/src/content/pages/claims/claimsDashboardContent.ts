import { ContentPageBase } from "../../contentPageBase";
import { Content } from "../../content";
import { ClaimMessages } from "@content/messages/claimMessages";
import { ClaimsLabels } from "@content/labels/claimsLabels";

export class ClaimsDashboardContent extends ContentPageBase {
  constructor(private readonly content: Content) {
    super(content, "claims-dashboard");
  }
  public readonly messages = new ClaimMessages(this);
  public readonly labels = new ClaimsLabels(this);
}
