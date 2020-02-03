import { ContentBase, ContentResult } from "./contentBase";

export type ContentSelector = (content: Content) => ContentResult;

export class Content extends ContentBase {
  constructor() {
    super(null, null);
  }
  public exampleContentTitle = () => this.getContent("example.contentTitle");
  public exampleContent = () => this.getContent("example.content");
}
