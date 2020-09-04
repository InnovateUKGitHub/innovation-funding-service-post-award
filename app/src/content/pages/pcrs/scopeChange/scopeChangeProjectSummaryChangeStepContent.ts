import { ContentPageBase } from "../../../contentPageBase";
import { Content } from "../../../content";
import { ProjectDto } from "@framework/dtos";
import { PCRItem } from "../pcrItem";

export class PCRScopeChangeProjectSummaryChangeContent extends ContentPageBase {
  constructor(content: Content, protected project: ProjectDto | null | undefined) {
    super(content, "pcr-scope-change-project-summary-change", project);
  }

  public readonly pcrItem = new PCRItem(this, this.project);

  public readonly projectSummaryHeading = () => this.getContent("heading-project-summary");
  public readonly publishedSummary = () => this.getContent("published-summary");
  public readonly noAvailableSummary = () => this.getContent("no-available-summary");
}
