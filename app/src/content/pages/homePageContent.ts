import { ContentPageBase } from "../contentPageBase";
import { Content } from "../content";

export class HomePageContent extends ContentPageBase {
  constructor(content: Content) {
    super(content, "home");
  }

  public readonly exampleContentTitle = () => this.getContent("example.contentTitle");
  public readonly exampleContent = () => this.getContent("example.content");

}
