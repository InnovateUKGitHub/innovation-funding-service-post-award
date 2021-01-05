import { ContentPageBase } from "@content/contentPageBase";
import { Content } from "../../content";
import { PartnerLabels } from "@content/labels/partnerLabels";

export class ProjectSetupBankDetailsContent extends ContentPageBase {
  constructor(content: Content, protected competitionType?: string) {
    super(content, "project-setup-bank-details", competitionType);
  }

  public readonly partnerLabels = new PartnerLabels(this, this.competitionType);
  public readonly guidanceMessage = this.getContent("guidance-message", { markdown: true });
  public readonly submitButton = this.getContent("submit-button");
  public readonly backLink = this.getContent("back-link");

  public readonly organisationInfoFieldsetTitle = this.getContent("fieldset-title-organisation-info");
  public readonly accountDetailsFieldsetTitle = this.getContent("fieldset-title-account-details");
  public readonly accountHolderFieldsetTitle = this.getContent("fieldset-title-account-holder");
  public readonly billingAddressFieldsetTitle = this.getContent("fieldset-title-billing-address");
  public readonly billingAddressFieldsetGuidance = this.getContent("fieldset-guidance-billing-address");
}
