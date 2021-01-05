import { ContentPageBase } from "../contentPageBase";
import { Content } from "../content";

export class LoadingContent extends ContentPageBase {
  constructor(content: Content, protected competitionType?: string) {
    super(content, "loading", competitionType);
  }

  public readonly message = this.getContent("components.loading.message");
}
