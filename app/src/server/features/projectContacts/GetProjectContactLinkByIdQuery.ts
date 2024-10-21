import { ProjectContactDto } from "@framework/dtos/projectContactDto";
import { IContext } from "@framework/types/IContext";
import { AsyncQueryBase } from "../common/queryBase";
import { mapToProjectContactDto } from "./mapToProjectContactDto";

export class GetProjectContactLinkByIdQuery extends AsyncQueryBase<ProjectContactDto> {
  public runnableName = "GetProjectContactLinkByIdQuery";

  constructor(private readonly pclId: ProjectContactLinkId) {
    super();
  }

  protected async run(context: IContext) {
    const results = await context.repositories.projectContacts.getById(this.pclId);
    return mapToProjectContactDto(results);
  }
}
