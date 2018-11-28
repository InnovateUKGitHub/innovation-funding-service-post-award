import { IContext, QueryBase } from "../common/context";
import { MapToProjectDtoCommand } from "./mapToProjectDto";
import { ProjectDto } from "../../../types";

export class GetByIdQuery extends QueryBase<ProjectDto|null> {
  constructor(readonly id: string) {
    super();
  }

  async Run(context: IContext) {
    const item = await context.repositories.projects.getById(this.id);
    return item && await context.runCommand(new MapToProjectDtoCommand(item));
  }
}
