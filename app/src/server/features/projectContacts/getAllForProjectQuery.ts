import { ProjectContactDto } from "@framework/dtos/projectContactDto";
import { IContext } from "@framework/types/IContext";
import { mapToProjectContactDto } from "./mapToProjectContactDto";
import { AuthorisedAsyncQueryBase } from "../common/queryBase";

export class GetAllForProjectQuery extends AuthorisedAsyncQueryBase<ProjectContactDto[]> {
  public readonly runnableName: string = "GetAllForProjectQuery";
  constructor(private readonly projectId: ProjectId) {
    super();
  }

  protected async run(context: IContext) {
    const results = await context.repositories.projectContacts.getAllByProjectId(this.projectId);
    return results.map(mapToProjectContactDto);
  }
}
