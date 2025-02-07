import { ProjectRolePermissionBits } from "@framework/constants/project";
import { Authorisation } from "@framework/types/authorisation";
import { IContext } from "@framework/types/IContext";
import { AuthorisedAsyncCommandBase } from "../common/commandBase";

export class DeleteProjectCostCommand extends AuthorisedAsyncCommandBase<boolean> {
  public readonly runnableName: string = "DeleteProjectCostCommand";
  constructor(
    private readonly projectId: ProjectId,
    private readonly pcrId: PcrId,
    private readonly pcrItemId: PcrItemId,
    private readonly costId: CostId,
  ) {
    super();
  }

  async accessControl(auth: Authorisation) {
    return auth.forProject(this.projectId).hasRole(ProjectRolePermissionBits.ProjectManager);
  }

  protected async run(context: IContext) {
    context.repositories.pcrSpendProfile.deleteSingleItem(this.costId);
    return true;
  }
}
