import { IContext, IQuery } from "../common/context";
import { ProjectDto } from "../../../ui/models";
import { ISalesforceProject } from "../../repositories/projectsRepository";
import { MapToProjectDtoCommand } from "./mapToProjectDto";

export class MapToProjectsDtoCommand implements IQuery<ProjectDto[]> {
  constructor(readonly items: ISalesforceProject[]) {}

  async Run(context: IContext) {
    const projectDtos = this.items.map((item) => {
      return new MapToProjectDtoCommand(item).Run(context);
    });

    return Promise.all(projectDtos);
  }
}
