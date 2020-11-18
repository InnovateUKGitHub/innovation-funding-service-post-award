import { ContentPageBase } from "../contentPageBase";
import { Content } from "../content";
import { ProjectDto } from "@framework/dtos";

export class DocumentSingleContent extends ContentPageBase {
  constructor(content: Content, protected project: ProjectDto | null | undefined) {
    super(content, "documentSingle", project);
  }

  public readonly newWindow = this.getContent("components.documentSingle.newWindow");
}
