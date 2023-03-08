import * as Dtos from "@framework/dtos";
import {
  Authorisation,
  getUnavailablePcrItemsMatrix,
  getUnduplicatablePcrItemsMatrix,
  IContext,
  PCRItemType,
  pcrOverpopulatedList,
  PCRSummaryDto,
  ProjectRole,
} from "@framework/types";

import { QueryBase } from "@server/features/common";
import { GetAllPCRsQuery } from "@server/features/pcrs/getAllPCRsQuery";
import { GetPCRItemTypesQuery } from "@server/features/pcrs/getItemTypesQuery";
import { GetAllForProjectQuery } from "../partners";
import { GetPCRByIdQuery } from "./getPCRByIdQuery";

export class GetAvailableItemTypesQuery extends QueryBase<Dtos.PCRItemTypeDto[]> {
  constructor(private readonly projectId: ProjectId, private readonly pcrId?: string) {
    super();
  }

  public async accessControl(auth: Authorisation) {
    return auth
      .forProject(this.projectId)
      .hasAnyRoles(ProjectRole.MonitoringOfficer, ProjectRole.ProjectManager, ProjectRole.FinancialContact);
  }

  /**
   * Get a list of PCR items that should be disabled, to prevent too many of a specific type
   * from being added to a PCR.
   *
   * @param numberOfPartners The number of partners in the project.
   * @param currentPcr The current PCR
   * @returns A list of PCR item types that should no longer have any more of the specified type.
   */
  private getOverpopulatedPcrItems(numberOfPartners: number, currentPcr?: PCRSummaryDto): PCRItemType[] {
    if (!currentPcr) return [];

    if (currentPcr.items.filter(x => pcrOverpopulatedList.includes(x.type)).length >= numberOfPartners)
      return pcrOverpopulatedList;

    return [];
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

    const disabledMatrixTypes = getUnavailablePcrItemsMatrix(projectPcrs);
    const currentPcrItemTypes = getUnduplicatablePcrItemsMatrix(currentPcr);
    const tooManyItemTypes = this.getOverpopulatedPcrItems(partners.length, currentPcr);

    const disabledTypes = [...currentPcrItemTypes, ...disabledMatrixTypes, ...tooManyItemTypes];

    return itemTypeDtos.reduce<Dtos.PCRItemTypeDto[]>((validPcrItems, pcrItem) => {
      // Note: Include items that are only true
      if (!pcrItem.enabled) return validPcrItems;

      const disabled = disabledTypes.some(disabledType => disabledType === pcrItem.type);

      return validPcrItems.concat({ ...pcrItem, disabled });
    }, []);
  }
}
