import { ContentBase } from "../contentBase";
import { ProjectDto } from "@framework/dtos";

export class TaskListContent extends ContentBase {
    constructor(parent: ContentBase, protected project: ProjectDto | null | undefined) {
        super(parent, "task-list", project);
    }

    public readonly sectionTitleEnterInfo = this.getContent("section-title-enter-info");
}
