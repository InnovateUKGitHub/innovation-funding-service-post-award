import { QueryBase } from "../common";
import { IContext, PartnerDto } from "@framework/types";
import { GetAllProjectRolesForUser } from "../projects";
import { MapToPartnerDtoCommand } from "./mapToPartnerDto";
import { sortPartners } from "./sortPartners";

export class GetAllQuery extends QueryBase<PartnerDto[]> {
  protected async Run(context: IContext): Promise<PartnerDto[]> {
      const results = await context.repositories.partners.getAll();
      const roles = await context.runQuery(new GetAllProjectRolesForUser());

      const mapped = results.map(item => {
          const projectRoles = roles.forProject(item.Acc_ProjectId__r.Id).getRoles();
          const partnerRoles = roles.forPartner(item.Acc_ProjectId__r.Id, item.Id).getRoles();
          return context.runSyncCommand(new MapToPartnerDtoCommand(item, partnerRoles, projectRoles));
      });

      return mapped.sort(sortPartners);
  }
}
