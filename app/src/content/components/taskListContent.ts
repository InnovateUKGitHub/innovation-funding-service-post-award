import { ContentBase } from "@content/contentBase";

export class TaskListContent extends ContentBase {
  constructor(parent: ContentBase, competitionType?: string) {
    super(parent, "task-list", competitionType);
  }

  public readonly sectionTitleEnterInfo = this.getContent("section-title-enter-info");
}
