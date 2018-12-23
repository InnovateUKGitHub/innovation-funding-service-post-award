import { QueryBase, IContext } from "../common/context";
import { ProjectRole } from "../../../types";
import { GetAllProjectRolesForUser } from "./getAllProjectRolesForUser";

export class GetProjectRolesForUser extends QueryBase<ProjectRole>{
  constructor(private projectId: string){
      super();
  }

  protected Run(context: IContext): Promise<ProjectRole> {
      return context.runQuery(new GetAllProjectRolesForUser())
          .then(x => x[this.projectId] || ProjectRole.Unknown);
  }
}
