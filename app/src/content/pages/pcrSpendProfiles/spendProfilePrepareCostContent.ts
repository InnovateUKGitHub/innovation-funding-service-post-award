import { ContentPageBase } from "@content/contentPageBase";
import { Content } from "@content/content";
import { PcrSpendProfileLabels } from "@content/labels/pcrSpendProfileLabels";
import { PcrSpendProfileMessages } from "@content/messages/pcrSpendProfileMessages";
import { DocumentLabels } from "@content/labels/documentLabels";
import { DocumentMessages } from "@content/messages/documentMessages";
import { ProjectDto } from "@framework/dtos";

export class PcrSpendProfilePrepareCostContent extends ContentPageBase {

  constructor(content: Content, protected project: ProjectDto | null | undefined) {
    super(content, "pcr-spend-profile-prepare-cost", project);
  }

  public readonly labels = new PcrSpendProfileLabels(this, this.project);
  public readonly messages = new PcrSpendProfileMessages(this, this.project);
  public readonly documentLabels = new DocumentLabels(this, this.project);
  public readonly documentMessages = new DocumentMessages(this, this.project);
  public readonly costSectionTitle = (costCategoryName: string) => this.getContent("section-title-cost", {costCategoryName});
  public readonly guidanceTitle = (costCategoryName: string) => this.getContent("guidance-title", {costCategoryName});
  public readonly backLink = (costCategoryName: string) => this.getContent("back-link", {costCategoryName});
  public readonly submitButton = (costCategoryName: string) => this.getContent("button-submit", {costCategoryName});
  public readonly overheads = {
    submitButton: () => this.getContent("overheads.button-submit"),
  };
}
