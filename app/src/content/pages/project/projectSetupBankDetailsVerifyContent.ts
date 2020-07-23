import { ContentPageBase } from "@content/contentPageBase";
import { Content } from "../../content";
import { PartnerLabels } from "@content/labels/partnerLabels";

export class ProjectSetupBankDetailsVerifyContent extends ContentPageBase {
  constructor(content: Content) {
    super(content, "project-setup-bank-details-verify");
  }

  public readonly partnerLabels = new PartnerLabels(this);
  public readonly guidanceMessage = () => this.getContent("guidance-message", {markdown: true});
  public readonly submitButton = () => this.getContent("submit-button");
  public readonly changeButton = () => this.getContent("change-button");
  public readonly backLink = () => this.getContent("back-link");
}
