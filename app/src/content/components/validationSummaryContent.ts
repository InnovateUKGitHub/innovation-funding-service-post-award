import { ContentPageBase } from "../contentPageBase";
import { Content } from "../content";
import { ProjectDto } from "@framework/dtos";

export class ValidationSummaryContent extends ContentPageBase {
  constructor(content: Content, protected project: ProjectDto | null | undefined) {
    super(content, "validationSummary", project);
  }

  public readonly validationsTitle = this.getContent("components.validationSummary.title");
}
