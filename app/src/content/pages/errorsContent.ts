import { ContentPageBase } from "../contentPageBase";
import { Content } from "../content";

export class NotFoundContent extends ContentPageBase {
  constructor(content: Content) {
    super(content, "error-not-found");
  }
}

export class UnexpectedErrorContent extends ContentPageBase {
  constructor(content: Content) {
    super(content, "error-unexpected");
  }
}
