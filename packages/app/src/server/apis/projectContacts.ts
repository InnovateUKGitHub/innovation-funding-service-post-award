import {
  ServerUpdateProjectContactsAssociateDetailsCommand,
  UpdateProjectContactLinkCommand,
} from "@server/features/projectContacts/UpdateProjectContactLinkCommand";
import { processDto } from "@shared/processResponse";
import { contextProvider } from "../features/common/contextProvider";

import { ApiParams, ControllerBase } from "./controllerBase";

export interface IProjectContactsApi<Context extends "client" | "server"> {
  update: (
    params: ApiParams<
      Context,
      { projectId: ProjectId; contacts: ServerUpdateProjectContactsAssociateDetailsCommand[] }
    >,
  ) => Promise<boolean>;
}

class Controller extends ControllerBase<"server", boolean> implements IProjectContactsApi<"server"> {
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
    return true;
  }
}

export const controller = new Controller();
