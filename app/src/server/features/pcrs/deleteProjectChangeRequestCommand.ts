import { PCRStatus } from "@framework/constants/pcrConstants";
import { ProjectRole } from "@framework/constants/project";
import { Authorisation } from "@framework/types/authorisation";
import { IContext } from "@framework/types/IContext";
import { BadRequestError } from "../common/appError";
import { CommandBase } from "../common/commandBase";

export class DeleteProjectChangeRequestCommand extends CommandBase<boolean> {
  constructor(
    private readonly projectId: ProjectId,
    private readonly pcrId: PcrId,
  ) {
    super();
  }

  public async accessControl(auth: Authorisation) {
    return auth.forProject(this.projectId).hasRole(ProjectRole.ProjectManager);
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
