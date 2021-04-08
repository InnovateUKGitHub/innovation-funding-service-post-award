import { ContentPageBase } from "../contentPageBase";
import { Content } from "../content";

export class DocumentViewContent extends ContentPageBase {
  constructor(content: Content) {
    super(content, "documentView");
  }

  public readonly fallbackValidationMessage = this.getContent("components.documentView.fallback-validation-message");
}
