import { PartnerDto } from "@framework/dtos/partnerDto";
import { IContext } from "@framework/types/IContext";
import { QueryBase } from "../common/queryBase";
import { GetAllProjectRolesForUser } from "../projects/getAllProjectRolesForUser";
import { MapToPartnerDtoCommand } from "./mapToPartnerDto";
import { sortPartners } from "./sortPartners";

export class GetAllQuery extends QueryBase<PartnerDto[]> {
  protected async run(context: IContext): Promise<PartnerDto[]> {
    const results = await context.repositories.partners.getAll();
    const roles = await context.runQuery(new GetAllProjectRolesForUser());

    const mapped = results.map(item => {
      const projectRoles = roles.forProject(item.projectId).getRoles();
      const partnerRoles = roles.forPartner(item.projectId, item.id).getRoles();
      return context.runSyncCommand(new MapToPartnerDtoCommand(item, partnerRoles, projectRoles));
    });

    return mapped.sort(sortPartners);
  }
}
