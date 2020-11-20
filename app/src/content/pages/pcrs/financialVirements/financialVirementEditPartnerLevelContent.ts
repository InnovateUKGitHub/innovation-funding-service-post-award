import { ContentPageBase } from "../../../contentPageBase";
import { Content } from "../../../content";
import { FinancialVirementLabels } from "@content/labels/financialVirementLabels";
import { ProjectDto } from "@framework/dtos";

export class FinancialVirementEditPartnerLevelContent extends ContentPageBase {
  constructor(content: Content, protected project: ProjectDto | null | undefined) {
    super(content, "financial-virement-edit-partner-level", project);
  }

  public readonly saveButton = this.getContent("save-button");

  public readonly remainingGrantInfo = this.getContent("remaining-grant-info");

  public readonly labels = new FinancialVirementLabels(this, this.project);
}
