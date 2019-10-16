import { BadRequestError, CommandBase } from "../common";
import { Authorisation, IContext, ProjectRole } from "@framework/types";
import { PCRStatus } from "@framework/constants";

export class DeleteProjectChangeRequestCommand extends CommandBase<boolean> {
  constructor(private projectId: string, private pcrId: string) {
    super();
  }

  public async accessControl(auth: Authorisation) {
    return auth.forProject(this.projectId).hasRole(ProjectRole.ProjectManager);
  }

  protected async Run(context: IContext): Promise<boolean> {
    const existing = await context.repositories.projectChangeRequests.getById(this.projectId, this.pcrId);

    if(existing.status !== PCRStatus.Draft) {
      throw new BadRequestError("Can only delete draft project change requests");
    }
    await context.repositories.projectChangeRequests.delete(existing);

    return true;
  }
}
