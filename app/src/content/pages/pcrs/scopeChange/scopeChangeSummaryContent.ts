import { ContentPageBase } from "../../../contentPageBase";
import { Content } from "../../../content";
import { ProjectDto } from "@framework/dtos";
import { PCRScopeChangeLabels } from "@content/labels/pcrScopeChangeLabels";

export class PCRScopeChangeSummaryContent extends ContentPageBase {
  constructor(content: Content, protected project: ProjectDto | null | undefined) {
    super(content, "pcr-scope-change-summary", project);
  }

  public readonly labels = new PCRScopeChangeLabels(this, this.project);
}
