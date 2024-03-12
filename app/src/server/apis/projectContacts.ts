import { ProjectContactDto } from "@framework/dtos/projectContactDto";
import { contextProvider } from "../features/common/contextProvider";
import { GetAllForProjectQuery } from "../features/projectContacts/getAllForProjectQuery";
import { ApiParams, ControllerBase } from "./controllerBase";
import { processDto } from "@shared/processResponse";
import { UpdateProjectContactsCommand } from "@server/features/projectContacts/updateProjectContactsCommand";

export interface IProjectContactsApi<Context extends "client" | "server"> {
  getAllByProjectId: (params: ApiParams<Context, { projectId: ProjectId }>) => Promise<ProjectContactDto[]>;
  update: (
    params: ApiParams<
      Context,
      { projectId: ProjectId; contacts: Pick<ProjectContactDto, "id" | "associateStartDate">[] }
    >,
  ) => Promise<ProjectContactDto[]>;
}

class Controller extends ControllerBase<"server", ProjectContactDto> implements IProjectContactsApi<"server"> {
  constructor() {
    super("project-contacts");

    this.getItems(
      "/:projectId",
      p => ({ projectId: p.projectId }),
      p => this.getAllByProjectId(p),
    );
    this.putItems(
      "/:projectId",
      (p, _, b: Pick<ProjectContactDto, "id" | "associateStartDate">[]) => ({
        projectId: p.projectId,
        contacts: processDto(b),
      }),
      p => this.update(p),
    );
  }

  public async getAllByProjectId(params: ApiParams<"server", { projectId: ProjectId }>) {
    const query = new GetAllForProjectQuery(params.projectId);
    return contextProvider.start(params).runQuery(query);
  }

  public async update(
    params: ApiParams<
      "server",
      { projectId: ProjectId; contacts: Pick<ProjectContactDto, "id" | "associateStartDate">[] }
    >,
  ) {
    const command = new UpdateProjectContactsCommand(params.projectId, params.contacts);
    await contextProvider.start(params).runCommand(command);
    return this.getAllByProjectId(params);
  }
}

export const controller = new Controller();
