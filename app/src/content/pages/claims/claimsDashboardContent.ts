import { ContentPageBase } from "../../contentPageBase";
import { Content } from "../../content";
import { ClaimMessages } from "@content/messages/claimMessages";
import { ClaimsLabels } from "@content/labels/claimsLabels";

export class ClaimsDashboardContent extends ContentPageBase {
  constructor(private readonly content: Content, protected competitionType?: string) {
    super(content, "claims-dashboard", competitionType);
  }
  public readonly messages = new ClaimMessages(this, this.competitionType);
  public readonly labels = new ClaimsLabels(this, this.competitionType);
}
