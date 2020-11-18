import { ContentPageBase } from "../contentPageBase";
import { Content } from "../content";
import { ProjectDto } from "@framework/dtos";

export class ClaimLastModifiedContent extends ContentPageBase {
  constructor(content: Content, protected project: ProjectDto | null | undefined) {
    super(content, "claimLastModified", project);
  }

  public readonly message = this.getContent("components.claimLastModified.message");
}
