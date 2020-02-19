import { ContentBase } from "../contentBase";

export class DocumentMessages extends ContentBase {
  constructor(parent: ContentBase) {
    super(parent, "document-messages");
  }

  public readonly header = () => this.getContent("header", { markdown: true });
  public readonly infoTitle = () => this.getContent("infoTitle");
  public readonly infoContent = () => this.getContent("infoContent", { markdown: true });
}
