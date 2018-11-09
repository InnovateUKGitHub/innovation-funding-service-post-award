import { IContext, IQuery } from "../common/context";
import { MapToProjectsDtoCommand } from "./mapToProjectsDto";
import { ProjectDto } from "../../../types";

export class GetAllQuery implements IQuery<ProjectDto[]|null> {
  async Run(context: IContext) {
    const items = await context.repositories.projects.getAll();
    return items && await context.runCommand(new MapToProjectsDtoCommand(items));
  }
}
