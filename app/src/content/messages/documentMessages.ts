import { ContentBase } from "../contentBase";

export class DocumentMessages extends ContentBase {
  constructor(parent: ContentBase) {
    super(parent, "document-messages");
  }

  public header = () => this.getContent("header", { markdown: true });
  public infoTitle = () => this.getContent("infoTitle");
  public infoContent = () => this.getContent("infoContent", { markdown: true });
}
