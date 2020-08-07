import { ContentPageBase } from "../contentPageBase";
import { Content } from "../content";
import { FinancialVirementLabels } from "@content/labels/financialVirementLabels";
import { ProjectDto } from "@framework/dtos";

export class FinancialVirementEditContent extends ContentPageBase {
  constructor(content: Content, protected project: ProjectDto | null | undefined) {
    super(content, "financial-virement-edit", project);
  }

  public readonly labels = new FinancialVirementLabels(this, this.project);

  public readonly summaryTitle = () => this.getContent("summary-title");
  public readonly saveButton = () => this.getContent("save-button");
}
