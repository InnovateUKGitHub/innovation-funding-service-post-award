import { Content } from "@content/content";
import { ContentPageBase } from "@content/contentPageBase";

export class LoadingContent extends ContentPageBase {
  constructor(content: Content, competitionType?: string) {
    super(content, "loading", competitionType);
  }

  public readonly message = this.getContent("components.loading.message");
}
