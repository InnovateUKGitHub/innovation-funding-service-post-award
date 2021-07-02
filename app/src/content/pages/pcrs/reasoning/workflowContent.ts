import { Content } from "@content/content";
import { ContentPageBase } from "@content/contentPageBase";
import { PCRReasoningLabels } from "@content/labels/pcrReasoningLabels";

export class PCRReasoningWorkflowContent extends ContentPageBase {
  constructor(content: Content, competitionType?: string) {
    super(content, "pcr-reasoning-workflow", competitionType);
  }

  public readonly labels = new PCRReasoningLabels(this, this.competitionType);
  public readonly backLink = this.getContent("back-link");
}
