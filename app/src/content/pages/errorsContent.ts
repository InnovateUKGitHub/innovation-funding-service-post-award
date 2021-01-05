import { ContentPageBase } from "../contentPageBase";
import { Content } from "../content";

export class NotFoundContent extends ContentPageBase {
  constructor(content: Content, protected competitionType?: string) {
    super(content, "error-not-found", competitionType);
  }

  public readonly errorTitle = this.getContent("pages.error-not-found.title");
}

export class UnexpectedErrorContent extends ContentPageBase {
  constructor(content: Content, protected competitionType?: string) {
    super(content, "error-unexpected", competitionType);
  }

  public readonly errorTitle = this.getContent("pages.error-unexpected.title.display");
}
