import { ProjectContactDto } from "@framework/dtos/projectContactDto";
import {
  CreateProjectContactCommand,
  ServerCreateProjectContactsCommandContact,
} from "@server/features/projectContacts/createProjectContactCommand";
import { GetProjectContactLinkByIdQuery } from "@server/features/projectContacts/GetProjectContactLinkByIdQuery";
import {
  ServerUpdateProjectContactsAssociateDetailsCommand,
  UpdateProjectContactLinkCommand,
} from "@server/features/projectContacts/UpdateProjectContactLinkCommand";
import { processDto } from "@shared/processResponse";
import { contextProvider } from "../features/common/contextProvider";
import { GetAllForProjectQuery } from "../features/projectContacts/getAllForProjectQuery";
import { ApiParams, ControllerBase } from "./controllerBase";

export interface IProjectContactsApi<Context extends "client" | "server"> {
  create: (
    params: ApiParams<Context, { projectId: ProjectId; contact: ServerCreateProjectContactsCommandContact }>,
  ) => Promise<ProjectContactDto>;

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

    this.postItem(
      "/:projectId",
      (p, _, b: ServerCreateProjectContactsCommandContact) => ({
        projectId: p.projectId,
        pcrId: p.pcrId,
        contact: processDto(b),
      }),
      p => this.create(p),
    );

    this.putItems(
      "/:projectId",
      (p, _, b: ServerUpdateProjectContactsAssociateDetailsCommand[]) => ({
        projectId: p.projectId,
        contacts: processDto(b),
      }),
      p => this.update(p),
    );
  }

  public async create(
    params: ApiParams<"server", { projectId: ProjectId; contact: ServerCreateProjectContactsCommandContact }>,
  ) {
    const command = new CreateProjectContactCommand(params.projectId, params.contact);
    const pclId = await contextProvider.start(params).runCommand(command);
    const query = new GetProjectContactLinkByIdQuery(pclId);
    return await contextProvider.start(params).runQuery(query);
  }

  public async update(
    params: ApiParams<
      "server",
      { projectId: ProjectId; contacts: ServerUpdateProjectContactsAssociateDetailsCommand[] }
    >,
  ) {
    const command = new UpdateProjectContactLinkCommand(params.projectId, params.contacts);
    await contextProvider.start(params).runCommand(command);
    const query = new GetAllForProjectQuery(params.projectId);
    return await contextProvider.start(params).runQuery(query);
  }
}

export const controller = new Controller();
