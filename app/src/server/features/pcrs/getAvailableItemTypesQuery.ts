import {
  getPcrItemsSingleInstanceInAnyPcrViolations,
  getPcrItemsSingleInstanceInThisPcrViolations,
  PCRItemHiddenReason,
  getPcrItemsTooManyViolations,
  getPcrItemsExclusivityViolations,
} from "@framework/constants/pcrConstants";
import { ProjectRolePermissionBits } from "@framework/constants/project";
import { PCRItemTypeDto } from "@framework/dtos/pcrDtos";
import { Authorisation } from "@framework/types/authorisation";
import { IContext } from "@framework/types/IContext";
import { GetAllPCRsQuery } from "@server/features/pcrs/getAllPCRsQuery";
import { GetPCRItemTypesQuery } from "@server/features/pcrs/getItemTypesQuery";
import { AuthorisedAsyncQueryBase } from "../common/queryBase";
import { GetAllForProjectQuery } from "../projectContacts/getAllForProjectQuery";
import { GetPCRByIdQuery } from "./getPCRByIdQuery";

export class GetAvailableItemTypesQuery extends AuthorisedAsyncQueryBase<PCRItemTypeDto[]> {
  public readonly runnableName: string = "GetAvailableItemTypesQuery";
  constructor(
    private readonly projectId: ProjectId,
    private readonly pcrId?: PcrId,
  ) {
    super();
  }

  public async accessControl(auth: Authorisation) {
    return auth
      .forProject(this.projectId)
      .hasAnyRoles(
        ProjectRolePermissionBits.MonitoringOfficer,
        ProjectRolePermissionBits.ProjectManager,
        ProjectRolePermissionBits.FinancialContact,
      );
  }

  protected async run(context: IContext): Promise<PCRItemTypeDto[]> {
    const itemTypeDtosPromise = context.runQuery(new GetPCRItemTypesQuery(this.projectId));
    const projectPcrsPromise = context.runQuery(new GetAllPCRsQuery(this.projectId));
    const partnersPromise = context.runQuery(new GetAllForProjectQuery(this.projectId));
    const currentPcrPromise = this.pcrId
      ? context.runQuery(new GetPCRByIdQuery(this.projectId, this.pcrId))
      : undefined;

    // Wait for all promises simultaneously
    await Promise.all([itemTypeDtosPromise, projectPcrsPromise, partnersPromise, currentPcrPromise]);

    const projectPcrs = await projectPcrsPromise;
    const itemTypeDtos = await itemTypeDtosPromise;
    const partners = await partnersPromise;
    const currentPcr = await currentPcrPromise;

    const nonDuplicatableItemTypesInAnyPcr = getPcrItemsSingleInstanceInAnyPcrViolations(projectPcrs);
    const nonDuplicatableItemTypesInThisPcr = getPcrItemsSingleInstanceInThisPcrViolations(currentPcr);
    const tooManyItemTypes = getPcrItemsTooManyViolations(partners.length, currentPcr);
    const exclusiveItemTypes = getPcrItemsExclusivityViolations(currentPcr);

    return itemTypeDtos.reduce<PCRItemTypeDto[]>((validPcrItems, pcrItem) => {
      // Note: Include items that are only true
      if (!pcrItem.enabled) return validPcrItems;

      let hiddenReason = PCRItemHiddenReason.None;

      if (exclusiveItemTypes.includes(pcrItem.type)) {
        hiddenReason = PCRItemHiddenReason.Exclusive;
      } else if (nonDuplicatableItemTypesInThisPcr.includes(pcrItem.type)) {
        hiddenReason = PCRItemHiddenReason.ThisPcrAlreadyHasThisType;
      } else if (nonDuplicatableItemTypesInAnyPcr.includes(pcrItem.type)) {
        hiddenReason = PCRItemHiddenReason.AnotherPcrAlreadyHasThisType;
      } else if (tooManyItemTypes.includes(pcrItem.type)) {
        hiddenReason = PCRItemHiddenReason.NotEnoughPartnersToActionThisType;
      }

      return validPcrItems.concat({
        ...pcrItem,
        hidden: hiddenReason !== PCRItemHiddenReason.None,
        hiddenReason,
      });
    }, []);
  }
}
