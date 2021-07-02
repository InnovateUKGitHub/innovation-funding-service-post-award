import { ClaimMessages } from "@content/messages/claimMessages";
import { ClaimsLabels } from "@content/labels/claimsLabels";
import { Content } from "@content/content";
import { ContentPageBase } from "@content/contentPageBase";

export class ClaimsDashboardContent extends ContentPageBase {
  constructor(content: Content, competitionType?: string) {
    super(content, "claims-dashboard", competitionType);
  }
  public readonly messages = new ClaimMessages(this, this.competitionType);
  public readonly labels = new ClaimsLabels(this, this.competitionType);
}
