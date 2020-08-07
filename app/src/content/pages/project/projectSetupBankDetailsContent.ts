import { ContentPageBase } from "@content/contentPageBase";
import { Content } from "../../content";
import { PartnerLabels } from "@content/labels/partnerLabels";
import { ProjectDto } from "@framework/dtos";

export class ProjectSetupBankDetailsContent extends ContentPageBase {
  constructor(content: Content, protected project: ProjectDto | null | undefined) {
    super(content, "project-setup-bank-details", project);
  }

  public readonly partnerLabels = new PartnerLabels(this, this.project);
  public readonly guidanceMessage = () => this.getContent("guidance-message", {markdown: true});
  public readonly submitButton = () => this.getContent("submit-button");
  public readonly backLink = () => this.getContent("back-link");

  public readonly organisationInfoFieldsetTitle = () => this.getContent("fieldset-title-organisation-info");
  public readonly accountDetailsFieldsetTitle = () => this.getContent("fieldset-title-account-details");
  public readonly accountHolderFieldsetTitle = () => this.getContent("fieldset-title-account-holder");
  public readonly billingAddressFieldsetTitle = () => this.getContent("fieldset-title-billing-address");
  public readonly billingAddressFieldsetGuidance = () => this.getContent("fieldset-guidance-billing-address");
}
