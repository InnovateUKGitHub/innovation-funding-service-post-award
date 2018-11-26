import { IContext, QueryBase } from "../common/context";
import { MapToProjectDtoCommand } from "./mapToProjectDto";
import { ProjectDto } from "../../../types";

export class GetAllQuery extends QueryBase<ProjectDto[]|null> {
  async Run(context: IContext) {
    const items = await context.repositories.projects.getAll();
    const mapped = items && items.map(x => context.runCommand(new MapToProjectDtoCommand(x)));
    return mapped && Promise.all(mapped);
  }
}
