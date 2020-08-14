import { ContentPageBase } from "../contentPageBase";
import { Content } from "../content";
import { ProjectDto } from "@framework/dtos";

export class HomePageContent extends ContentPageBase {
  constructor(content: Content, protected project: ProjectDto | null | undefined) {
    super(content, "home", project);
  }

  public readonly exampleContentTitle = () => this.getContent("example.contentTitle");
  public readonly exampleContent = () => this.getContent("example.content");

}
