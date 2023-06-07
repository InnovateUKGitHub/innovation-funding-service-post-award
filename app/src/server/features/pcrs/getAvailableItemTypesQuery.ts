import * as Dtos from "@framework/dtos";
import {
  Authorisation,
  getUnavailablePcrItemsMatrix,
  getUnduplicatablePcrItemsMatrix,
  IContext,
  PCRItemDisabledReason,
  PCRItemType,
  PCRSummaryDto,
  ProjectRole,
} from "@framework/types";

import { QueryBase } from "@server/features/common";
import { GetAllPCRsQuery } from "@server/features/pcrs/getAllPCRsQuery";
import { GetPCRItemTypesQuery } from "@server/features/pcrs/getItemTypesQuery";
import { GetAllForProjectQuery } from "../partners";
import { GetPCRByIdQuery } from "./getPCRByIdQuery";

export class GetAvailableItemTypesQuery extends QueryBase<Dtos.PCRItemTypeDto[]> {
  constructor(private readonly projectId: ProjectId, private readonly pcrId?: PcrId) {
    super();
  }

  public async accessControl(auth: Authorisation) {
    return auth
      .forProject(this.projectId)
      .hasAnyRoles(ProjectRole.MonitoringOfficer, ProjectRole.ProjectManager, ProjectRole.FinancialContact);
  }

  /**
   * Get a list of PCR items that should be disabled, to prevent too many items that action on
   * partners.
   *
   * @param numberOfPartners The number of partners in the project.
   * @param currentPcr The current PCR
   * @returns A list of PCR item types that should no longer have any more of the specified type.
   */
  private getPcrItemsLimitedByNumberOfPartners(numberOfPartners: number, currentPcr?: PCRSummaryDto): PCRItemType[] {
    if (!currentPcr) return [];

    const { items } = currentPcr;
    const bannedTypes: PCRItemType[] = [];

    // If we already have `n` renames, disallow adding an `n+1`th rename.
    if (items.filter(x => x.type === PCRItemType.AccountNameChange).length >= numberOfPartners)
      bannedTypes.push(PCRItemType.AccountNameChange);

    const hasAnyAdditions = items.some(x => x.type === PCRItemType.PartnerAddition);

    // Maximum number of deletes allowed.
    // `n`   You can delete all partners if we have any additions
    // `n-1` You cannot delete all partners if there are no additions
    const maxDeletes = hasAnyAdditions ? numberOfPartners : numberOfPartners - 1;

    if (items.filter(x => x.type === PCRItemType.PartnerWithdrawal).length >= maxDeletes)
      bannedTypes.push(PCRItemType.PartnerWithdrawal);

    return bannedTypes;
  }

  protected async run(context: IContext): Promise<Dtos.PCRItemTypeDto[]> {
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

    const nonDuplicatableItemTypesInAnyPcr = getUnavailablePcrItemsMatrix(projectPcrs);
    const nonDuplicatableItemTypesInThisPcr = getUnduplicatablePcrItemsMatrix(currentPcr);
    const tooManyItemTypes = this.getPcrItemsLimitedByNumberOfPartners(partners.length, currentPcr);

    return itemTypeDtos.reduce<Dtos.PCRItemTypeDto[]>((validPcrItems, pcrItem) => {
      // Note: Include items that are only true
      if (!pcrItem.enabled) return validPcrItems;

      let disabledReason = PCRItemDisabledReason.None;

      if (nonDuplicatableItemTypesInAnyPcr.includes(pcrItem.type)) {
        disabledReason = PCRItemDisabledReason.AnotherPcrAlreadyHasThisType;
      } else if (nonDuplicatableItemTypesInThisPcr.includes(pcrItem.type)) {
        disabledReason = PCRItemDisabledReason.ThisPcrAlreadyHasThisType;
      } else if (tooManyItemTypes.includes(pcrItem.type)) {
        disabledReason = PCRItemDisabledReason.NotEnoughPartnersToActionThisType;
      }

      return validPcrItems.concat({
        ...pcrItem,
        disabled: disabledReason !== PCRItemDisabledReason.None,
        disabledReason,
      });
    }, []);
  }
}
