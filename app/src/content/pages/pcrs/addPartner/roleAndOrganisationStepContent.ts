import { PCRAddPartnerLabels } from "@content/labels/pcrAddPartnerLabels";
import { Content } from "@content/content";
import { ContentPageBase } from "@content/contentPageBase";
import { PCRItem } from "../pcrItem";

export class PCRAddPartnerRoleAndOrganisationContent extends ContentPageBase {
  constructor(content: Content, competitionType?: string) {
    super(content, "pcr-add-partner-role-and-organisation", competitionType);
  }

  public readonly pcrItem = new PCRItem(this, this.competitionType);
  public readonly labels = new PCRAddPartnerLabels(this, this.competitionType);

  public readonly formSectionTitle = this.getContent("form-section-title");
  public readonly validationMessage = this.getContent("validation-message");
  public readonly infoSummary = this.getContent("info-summary");
  public readonly organisationTypeInfo = this.getContent("organisation-type-info", { markdown: true });
  public readonly organisationTypeHint = this.getContent("organisation-type-hint");
}
