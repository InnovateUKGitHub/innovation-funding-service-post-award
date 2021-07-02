import { Content } from "@content/content";
import { ContentPageBase } from "@content/contentPageBase";

export class DocumentViewContent extends ContentPageBase {
  constructor(content: Content) {
    super(content, "documentView");
  }

  public readonly fallbackValidationMessage = this.getContent("components.documentView.fallback-validation-message");
}
