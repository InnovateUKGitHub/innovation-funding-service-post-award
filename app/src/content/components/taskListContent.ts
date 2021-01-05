import { ContentBase } from "../contentBase";

export class TaskListContent extends ContentBase {
  constructor(parent: ContentBase, protected competitionType?: string) {
    super(parent, "task-list", competitionType);
  }

  public readonly sectionTitleEnterInfo = this.getContent("section-title-enter-info");
}
