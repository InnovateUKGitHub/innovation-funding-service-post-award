import { IContext, IQuery } from "../common/context";
import { ISalesforceProject } from "../../repositories/projectsRepository";
import { MapToProjectDtoCommand } from "./mapToProjectDto";
import { ProjectDto } from "../../../types";

export class MapToProjectsDtoCommand implements IQuery<ProjectDto[]> {
  constructor(readonly items: ISalesforceProject[]) {}

  async Run(context: IContext) {
    const projectDtos = this.items.map((item) => {
      return new MapToProjectDtoCommand(item).Run(context);
    });

    return Promise.all(projectDtos);
  }
}
