import { ContentPageBase } from "../contentPageBase";
import { Content } from "../content";

export class DocumentSingleContent extends ContentPageBase {
  constructor(content: Content, protected competitionType?: string) {
    super(content, "documentSingle", competitionType);
  }

  public readonly newWindow = this.getContent("components.documentSingle.newWindow");
}
