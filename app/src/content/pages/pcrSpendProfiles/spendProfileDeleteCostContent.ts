import { ContentPageBase } from "@content/contentPageBase";
import { Content } from "@content/content";
import { PcrSpendProfileLabels } from "@content/labels/pcrSpendProfileLabels";

export class PcrSpendProfileDeleteCostContent extends ContentPageBase {
  constructor(content: Content, protected competitionType?: string) {
    super(content, "pcr-spend-profile-delete-cost", competitionType);
  }

  public readonly labels = new PcrSpendProfileLabels(this, this.competitionType);
  public readonly costSectionTitle = (costCategoryName: string) =>
    this.getContent("section-title-cost", { costCategoryName });
  public readonly backLink = (costCategoryName: string) => this.getContent("back-link", { costCategoryName });
  public readonly deleteButton = this.getContent("button-delete");
  public readonly deleteGuidance = this.getContent("guidance-delete");
}
