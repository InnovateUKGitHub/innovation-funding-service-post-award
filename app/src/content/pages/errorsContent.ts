import { ContentPageBase } from "../contentPageBase";
import { Content } from "../content";
import { ProjectDto } from "@framework/dtos";

export class NotFoundContent extends ContentPageBase {
  constructor(content: Content, protected project: ProjectDto | null | undefined) {
    super(content, "error-not-found", project);
  }
}

export class UnexpectedErrorContent extends ContentPageBase {
  constructor(content: Content, protected project: ProjectDto | null | undefined) {
    super(content, "error-unexpected", project);
  }
}
