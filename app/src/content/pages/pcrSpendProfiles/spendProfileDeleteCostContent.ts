import { ContentPageBase } from "@content/contentPageBase";
import { Content } from "@content/content";
import { PcrSpendProfileLabels } from "@content/labels/pcrSpendProfileLabels";
import { ProjectDto } from "@framework/dtos";

export class PcrSpendProfileDeleteCostContent extends ContentPageBase {

  constructor(content: Content, protected project: ProjectDto | null | undefined) {
    super(content, "pcr-spend-profile-delete-cost", project);
  }

  public readonly labels = new PcrSpendProfileLabels(this, this.project);
  public readonly costSectionTitle = (costCategoryName: string) => this.getContent("section-title-cost", {costCategoryName});
  public readonly backLink = (costCategoryName: string) => this.getContent("back-link", {costCategoryName});
  public readonly deleteButton = () => this.getContent("button-delete");
  public readonly deleteGuidance = () => this.getContent("guidance-delete");
}
