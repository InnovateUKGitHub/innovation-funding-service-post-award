import { ContentPageBase } from "../../contentPageBase";
import { Content } from "../../content";
import { ClaimsLabels } from "@content/labels/claimsLabels";
import { ClaimMessages } from "@content/messages/claimMessages";

export class AllClaimsDashboardContent extends ContentPageBase {
  constructor(private readonly content: Content, protected competitionType?: string) {
    super(content, "all-claims-dashboard", competitionType);
  }
  public readonly messages = new ClaimMessages(this, this.competitionType);
  public readonly labels = new ClaimsLabels(this, this.competitionType);
}
