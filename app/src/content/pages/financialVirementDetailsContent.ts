import { ContentPageBase } from "../contentPageBase";
import { Content } from "../content";
import { FinancialVirementLabels } from "@content/labels/financialVirementLabels";
import { ProjectDto } from "@framework/dtos";

export class FinancialVirementDetailsContent extends ContentPageBase {
  constructor(content: Content, protected project: ProjectDto | null | undefined) {
    super(content, "financial-virement-details", project);
  }

  public readonly labels = new FinancialVirementLabels(this, this.project);
}
