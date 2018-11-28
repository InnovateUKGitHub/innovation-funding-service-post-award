import { CommandBase, IContext } from "../common/context";
import { ISalesforceProject } from "../../repositories/projectsRepository";
import { MapToProjectDtoCommand } from "./mapToProjectDto";
import { ProjectDto } from "../../../types";

export class MapToProjectsDtoCommand extends CommandBase<ProjectDto[]> {
  constructor(readonly items: ISalesforceProject[]) {
    super();
  }

  async Run(context: IContext) {
    const projectDtos = this.items.map((item) => {
      return new MapToProjectDtoCommand(item).Run(context);
    });

    return Promise.all(projectDtos);
  }
}
