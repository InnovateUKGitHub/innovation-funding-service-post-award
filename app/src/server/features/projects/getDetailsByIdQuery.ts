import { IContext, IQuery } from "../common/context";
import { ProjectDto } from "../../../models";
import { MapToProjectDtoCommand } from "./mapToProjectDto";

export class GetByIdQuery implements IQuery<ProjectDto|null> {
  constructor(readonly id: string) {}

  async Run(context: IContext) {
    const item = await context.repositories.projects.getById(this.id);
    return item && await context.runCommand(new MapToProjectDtoCommand(item));
  }
}
