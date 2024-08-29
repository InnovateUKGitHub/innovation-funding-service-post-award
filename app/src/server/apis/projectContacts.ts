import { ProjectContactDto } from "@framework/dtos/projectContactDto";
import { contextProvider } from "../features/common/contextProvider";
import { GetAllForProjectQuery } from "../features/projectContacts/getAllForProjectQuery";
import { ApiParams, ControllerBase } from "./controllerBase";
import { processDto } from "@shared/processResponse";
import {
  ServerUpdateProjectContactsAssociateDetailsCommand,
  UpdateProjectContactsAssociateDetailsCommand,
} from "@server/features/projectContacts/updateProjectContactsAssociateDetailsCommand";
import {
  CreateProjectContactCommand,
  ServerCreateProjectContactsCommandContact,
} from "@server/features/projectContacts/createProjectContactCommand";
import { GetProjectContactLinkByIdQuery } from "@server/features/projectContacts/GetProjectContactLinkByIdQuery";
import {
  ServerManageContactUpdateCommand,
  UpdateProjectManageContactCommand,
} from "@server/features/projectContacts/updateProjectManageContactDetails";

export interface IProjectContactsApi<Context extends "client" | "server"> {
  create: (
    params: ApiParams<Context, { projectId: ProjectId; contact: ServerCreateProjectContactsCommandContact }>,
  ) => Promise<ProjectContactDto>;

  updateAssociateDetails: (
    params: ApiParams<
      Context,
      { projectId: ProjectId; contacts: ServerUpdateProjectContactsAssociateDetailsCommand[] }
    >,
  ) => Promise<ProjectContactDto[]>;

  updateContactDetails: (
    params: ApiParams<Context, { projectId: ProjectId; contact: ServerManageContactUpdateCommand }>,
  ) => Promise<ProjectContactDto[]>;
}

class Controller extends ControllerBase<"server", ProjectContactDto> implements IProjectContactsApi<"server"> {
  constructor() {
    super("project-contacts");

    this.postItem(
      "/:projectId",
      (p, _, b: ServerCreateProjectContactsCommandContact) => ({
        projectId: p.projectId,
        contact: processDto(b),
      }),
      p => this.create(p),
    );

    this.putItems(
      "/associate/:projectId",
      (p, _, b: ServerUpdateProjectContactsAssociateDetailsCommand[]) => ({
        projectId: p.projectId,
        contacts: processDto(b),
      }),
      p => this.updateAssociateDetails(p),
    );

    this.putItems(
      "/manage/:projectId",
      (p, _, b: ServerManageContactUpdateCommand) => ({
        projectId: p.projectId,
        contact: processDto(b),
      }),
      p => this.updateContactDetails(p),
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

  public async updateAssociateDetails(
    params: ApiParams<
      "server",
      { projectId: ProjectId; contacts: ServerUpdateProjectContactsAssociateDetailsCommand[] }
    >,
  ) {
    const command = new UpdateProjectContactsAssociateDetailsCommand(params.projectId, params.contacts);
    await contextProvider.start(params).runCommand(command);
    const query = new GetAllForProjectQuery(params.projectId);
    return await contextProvider.start(params).runQuery(query);
  }

  public async updateContactDetails(
    params: ApiParams<"server", { projectId: ProjectId; contact: ServerManageContactUpdateCommand }>,
  ) {
    const command = new UpdateProjectManageContactCommand(params.projectId, params.contact);
    await contextProvider.start(params).runCommand(command);
    const query = new GetAllForProjectQuery(params.projectId);
    return await contextProvider.start(params).runQuery(query);
  }
}

export const controller = new Controller();
