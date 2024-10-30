import { ProjectContactDto } from "@framework/dtos/projectContactDto";
import {
  ServerUpdateProjectContactsAssociateDetailsCommand,
  UpdateProjectContactLinkCommand,
} from "@server/features/projectContacts/UpdateProjectContactLinkCommand";
import { processDto } from "@shared/processResponse";
import { contextProvider } from "../features/common/contextProvider";
import { GetAllForProjectQuery } from "../features/projectContacts/getAllForProjectQuery";
import { ApiParams, ControllerBase } from "./controllerBase";

export interface IProjectContactsApi<Context extends "client" | "server"> {
  update: (
    params: ApiParams<
      Context,
      { projectId: ProjectId; contacts: ServerUpdateProjectContactsAssociateDetailsCommand[] }
    >,
  ) => Promise<ProjectContactDto[]>;
}

class Controller extends ControllerBase<"server", ProjectContactDto> implements IProjectContactsApi<"server"> {
  constructor() {
    super("project-contacts");

    this.putItems(
      "/:projectId",
      (p, _, b: ServerUpdateProjectContactsAssociateDetailsCommand[]) => ({
        projectId: p.projectId,
        contacts: processDto(b),
      }),
      p => this.update(p),
    );
  }

  public async update(
    params: ApiParams<
      "server",
      { projectId: ProjectId; contacts: ServerUpdateProjectContactsAssociateDetailsCommand[] }
    >,
  ) {
    const ctx = await contextProvider.start(params);
    const command = new UpdateProjectContactLinkCommand(params.projectId, params.contacts);
    await ctx.runCommand(command);
    const query = new GetAllForProjectQuery(params.projectId);
    return await ctx.runQuery(query);
  }
}

export const controller = new Controller();
