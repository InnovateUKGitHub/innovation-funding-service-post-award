import { ContentPageBase } from "@content/contentPageBase";
import { Content } from "@content/content";
import { PcrSpendProfileLabels } from "@content/labels/pcrSpendProfileLabels";
import { PcrSpendProfileMessages } from "@content/messages/pcrSpendProfileMessages";
import { DocumentLabels } from "@content/labels/documentLabels";
import { DocumentMessages } from "@content/messages/documentMessages";

export class PcrSpendProfilePrepareCostContent extends ContentPageBase {
  constructor(content: Content, competitionType?: string) {
    super(content, "pcr-spend-profile-prepare-cost", competitionType);
  }

  public readonly labels = new PcrSpendProfileLabels(this, this.competitionType);
  public readonly messages = new PcrSpendProfileMessages(this, this.competitionType);
  public readonly documentLabels = new DocumentLabels(this, this.competitionType);
  public readonly documentMessages = new DocumentMessages(this, this.competitionType);
  public readonly costSectionTitle = (costCategoryName: string) =>
    this.getContent("section-title-cost", { costCategoryName });
  public readonly guidanceTitle = (costCategoryName: string) => this.getContent("guidance-title", { costCategoryName });
  public readonly backLink = (costCategoryName: string) => this.getContent("back-link", { costCategoryName });
  public readonly submitButton = (costCategoryName: string) => this.getContent("button-submit", { costCategoryName });
  public readonly overheads = {
    submitButton: this.getContent("overheads.button-submit"),
  };
}
