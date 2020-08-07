import { ContentPageBase } from "../contentPageBase";
import { Content } from "../content";
import { FinancialVirementLabels } from "@content/labels/financialVirementLabels";
import { ProjectDto } from "@framework/dtos";

export class FinancialVirementSummaryContent extends ContentPageBase {
  constructor(content: Content, protected project: ProjectDto | null | undefined) {
    super(content, "financial-virement-summary", project);
  }

  public readonly labels = new FinancialVirementLabels(this, this.project);
}
