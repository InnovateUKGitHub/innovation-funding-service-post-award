import { PCRStatus } from "@framework/constants/pcrConstants";
import { ProjectRolePermissionBits } from "@framework/constants/project";
import { Authorisation } from "@framework/types/authorisation";
import { IContext } from "@framework/types/IContext";
import { BadRequestError } from "../common/appError";
import { AuthorisedAsyncCommandBase } from "../common/commandBase";

export class DeleteProjectChangeRequestCommand extends AuthorisedAsyncCommandBase<boolean> {
  public readonly runnableName: string = "DeleteProjectChangeRequestCommand";
  constructor(
    private readonly projectId: ProjectId,
    private readonly pcrId: PcrId,
  ) {
    super();
  }

  public async accessControl(auth: Authorisation) {
    return auth.forProject(this.projectId).hasRole(ProjectRolePermissionBits.ProjectManager);
  }

  protected async run(context: IContext): Promise<boolean> {
    const existing = await context.repositories.projectChangeRequests.getById(this.projectId, this.pcrId);

    if (existing.status !== PCRStatus.DraftWithProjectManager) {
      throw new BadRequestError("Can only delete draft project change requests");
    }
    await context.repositories.projectChangeRequests.delete(existing);

    return true;
  }
}
