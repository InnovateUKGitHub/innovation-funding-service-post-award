import { ContentPageBase } from "../../contentPageBase";
import { Content } from "../../content";
import { ClaimsLabels } from "@content/labels/claimsLabels";
import { ClaimMessages } from "@content/messages/claimMessages";

export class AllClaimsDashboardContent extends ContentPageBase {
  constructor(private readonly content: Content) {
    super(content, "all-claims-dashboard");
  }
  public readonly messages = new ClaimMessages(this);
  public readonly labels = new ClaimsLabels(this);
}
