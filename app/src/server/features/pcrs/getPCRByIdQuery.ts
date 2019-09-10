import { QueryBase } from "../common";
import { PCRDto } from "@framework/dtos/pcrDtos";
import { Authorisation, IContext, ProjectRole } from "@framework/types";
import { GetPCRItemTypesQuery } from "./getItemTypesQuery";
import { mapToPcrDto } from "./mapToPCRDto";

export class GetPCRByIdQuery extends QueryBase<PCRDto> {
  constructor(private projectId: string, private id: string) {
    super();
  }

  protected async accessControl(auth: Authorisation, context: IContext) {
    return context.config.features.pcrsEnabled && auth.forProject(this.projectId).hasAnyRoles(ProjectRole.MonitoringOfficer, ProjectRole.ProjectManager);
  }

  protected async Run(context: IContext): Promise<PCRDto> {
    const itemTypes = await context.runQuery(new GetPCRItemTypesQuery());
    const item = await context.repositories.pcrs.getById(this.projectId, this.id);
    return mapToPcrDto(item, itemTypes);
  }
}
