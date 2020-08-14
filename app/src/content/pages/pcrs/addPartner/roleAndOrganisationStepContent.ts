import { ContentPageBase } from "../../../contentPageBase";
import { Content } from "../../../content";
import { PCRItem } from "../pcrItem";
import { PCRAddPartnerLabels } from "@content/labels/pcrAddPartnerLabels";
import { ProjectDto } from "@framework/dtos";

export class PCRAddPartnerRoleAndOrganisationContent extends ContentPageBase {
  constructor(private readonly content: Content, protected project: ProjectDto | null | undefined) {
    super(content, "pcr-add-partner-role-and-organisation", project);
  }

  public readonly pcrItem = new PCRItem(this, this.project);
  public readonly labels = new PCRAddPartnerLabels(this, this.project);

  public readonly formSectionTitle = () => this.getContent("form-section-title");
  public readonly validationMessage = () => this.getContent("validation-message");
  public readonly infoSummary = () => this.getContent("info-summary");
  public readonly organisationTypeInfo = () => this.getContent("organisation-type-info", { markdown: true });
  public readonly organisationTypeHint = () => this.getContent("organisation-type-hint");
}
