import { ContentPageBase } from "../../../contentPageBase";
import { Content } from "../../../content";
import { ProjectDto } from "@framework/dtos";
import { PCRReasoningLabels } from "@content/labels/pcrReasoningLabels";

export class PCRReasoningWorkflowContent extends ContentPageBase {
  constructor(content: Content, protected project: ProjectDto | null | undefined) {
    super(content, "pcr-reasoning-workflow", project);
  }

  public readonly labels = new PCRReasoningLabels(this, this.project);
  public readonly backLink = () => this.getContent("back-link");
}
