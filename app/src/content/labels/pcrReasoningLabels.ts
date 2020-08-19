import { ContentBase } from "@content/contentBase";
import { ProjectDto } from "@framework/dtos";

export class PCRReasoningLabels extends ContentBase {
  constructor(parent: ContentBase, protected project: ProjectDto | null | undefined) {
    super(parent, "pcr-reasoning-labels", project);
  }

  public readonly requestNumber = () => this.getContent("request-number");
  public readonly types = () => this.getContent("types");
  public readonly comments = () => this.getContent("comments");
  public readonly files = () => this.getContent("files");
}
