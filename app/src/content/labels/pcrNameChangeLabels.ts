import { ContentBase } from "@content/contentBase";
import { ProjectDto } from "@framework/dtos";

export class PCRNameChangeLabels extends ContentBase {
  constructor(parent: ContentBase, protected project: ProjectDto | null | undefined) {
    super(parent, "pcr-name-change-labels", project);
  }

  public readonly enterName = () => this.getContent("enter-name");
  public readonly exisitingName = () => this.getContent("exiting-name");
  public readonly proposedName = () => this.getContent("proposed-name");
  public readonly certificate = () => this.getContent("certificate");
}
