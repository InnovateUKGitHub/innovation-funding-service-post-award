import { ContentPageBase } from "../../../contentPageBase";
import { Content } from "../../../content";
import { ProjectDto } from "@framework/dtos";
import { PCRItem } from "../pcrItem";

export class PCRReasoningPrepareReasoningContent extends ContentPageBase {
  constructor(content: Content, protected project: ProjectDto | null | undefined) {
    super(content, "pcr-reasoning-prepare-reasoning", project);
  }

  public readonly pcrItem = new PCRItem(this, this.project);
  public readonly hint = () => this.getContent("hint", {markdown: true});
  public readonly reasoningHeading = () => this.getContent("heading-reasoning");
}
