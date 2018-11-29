import { IContext, QueryBase } from "../common/context";
import { MapToProjectsDtoCommand } from "./mapToProjectsDto";
import { ProjectDto } from "../../../types";

export class GetAllQuery extends QueryBase<ProjectDto[]|null> {
  async Run(context: IContext) {
    const items = await context.repositories.projects.getAll();
    return items && await context.runCommand(new MapToProjectsDtoCommand(items));
  }
}
