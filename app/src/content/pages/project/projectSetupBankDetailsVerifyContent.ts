import { ContentPageBase } from "@content/contentPageBase";
import { PartnerLabels } from "@content/labels/partnerLabels";
import { Content } from "../../content";

export class ProjectSetupBankDetailsVerifyContent extends ContentPageBase {
  constructor(content: Content, protected competitionType?: string) {
    super(content, "project-setup-bank-details-verify", competitionType);
  }

  public readonly partnerLabels = new PartnerLabels(this, this.competitionType);
  public readonly guidanceMessage = this.getContent("guidance-message", { markdown: true });
  public readonly submitButton = this.getContent("submit-button");
  public readonly changeButton = this.getContent("change-button");
  public readonly backLink = this.getContent("back-link");
}
