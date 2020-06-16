import { ContentBase } from "../contentBase";

export class TaskListContent extends ContentBase {
    constructor(parent: ContentBase) {
        super(parent, "task-list");
    }

    public readonly sectionTitleEnterInfo = () => this.getContent("section-title-enter-info");
}
