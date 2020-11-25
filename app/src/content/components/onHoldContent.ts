import { ContentPageBase } from "../contentPageBase";
import { Content } from "../content";
import { ProjectDto } from "@framework/dtos";

export class OnHoldContent extends ContentPageBase {
  constructor(content: Content, protected project: ProjectDto | null | undefined) {
    super(content, "onHoldContent", project);
  }

  public readonly projectOnHoldMessage = this.getContent("components.onHoldContent.projectOnHoldMessage");
  public readonly partnerOnHoldMessage = this.getContent("components.onHoldContent.partnerOnHoldMessage");
}
