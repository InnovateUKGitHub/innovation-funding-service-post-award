import { ContentPageBase } from "../../../contentPageBase";
import { Content } from "../../../content";
import { PCRReasoningLabels } from "@content/labels/pcrReasoningLabels";

export class PCRReasoningWorkflowContent extends ContentPageBase {
  constructor(content: Content, protected competitionType?: string) {
    super(content, "pcr-reasoning-workflow", competitionType);
  }

  public readonly labels = new PCRReasoningLabels(this, this.competitionType);
  public readonly backLink = this.getContent("back-link");
}
