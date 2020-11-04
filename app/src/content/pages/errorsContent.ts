import { ContentPageBase } from "../contentPageBase";
import { Content } from "../content";
import { ProjectDto } from "@framework/dtos";

export class NotFoundContent extends ContentPageBase {
  constructor(content: Content, protected project: ProjectDto | null | undefined) {
    super(content, "error-not-found", project);
  }

  public readonly errorTitle = this.getContent("pages.error-not-found.title");

}

export class UnexpectedErrorContent extends ContentPageBase {
  constructor(content: Content, protected project: ProjectDto | null | undefined) {
    super(content, "error-unexpected", project);
  }

  public readonly errorTitle = this.getContent("pages.error-unexpected.title.display");

}
