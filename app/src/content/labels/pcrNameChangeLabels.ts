import { ContentBase } from "@content/contentBase";

export class PCRNameChangeLabels extends ContentBase {
  constructor(parent: ContentBase, protected competitionType?: string) {
    super(parent, "pcr-name-change-labels", competitionType);
  }

  public readonly enterName = this.getContent("enter-name");
  public readonly exisitingName = this.getContent("exiting-name");
  public readonly proposedName = this.getContent("proposed-name");
  public readonly certificate = this.getContent("certificate");
}
