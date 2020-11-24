import { ContentPageBase } from "../../contentPageBase";
import { Content } from "../../content";
import { ProjectDto } from "@framework/dtos";

export class PCRCreateContent extends ContentPageBase {
  constructor(private readonly content: Content, protected project: ProjectDto | null | undefined) {
    super(content, "pcr-create", project);
  }

  public readonly guidanceMessage = this.getContent("guidance-message", { markdown: true });
  public readonly selectRequestTypesTitle = this.getContent("select-request-types-title");
  public readonly selectTypesHint = this.getContent("select-types-hint");
  public readonly backLink = this.getContent("back-link");
  public readonly createRequestButton = this.getContent("button-create-request");
  public readonly cancelRequestButton = this.getContent("button-cancel-request");
}
