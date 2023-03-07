import { getUnavailablePcrItemsMatrix, getUnduplicatablePcrItemsMatrix } from "@framework/types";
import * as Dtos from "@framework/dtos";
import { Authorisation, IContext, ProjectRole } from "@framework/types";

import { QueryBase } from "@server/features/common";
import { GetPCRItemTypesQuery } from "@server/features/pcrs/getItemTypesQuery";
import { GetAllPCRsQuery } from "@server/features/pcrs/getAllPCRsQuery";

export class GetAvailableItemTypesQuery extends QueryBase<Dtos.PCRItemTypeDto[]> {
  constructor(private readonly projectId: ProjectId, private readonly pcrId?: string) {
    super();
  }

  public async accessControl(auth: Authorisation) {
    return auth
      .forProject(this.projectId)
      .hasAnyRoles(ProjectRole.MonitoringOfficer, ProjectRole.ProjectManager, ProjectRole.FinancialContact);
  }

  protected async run(context: IContext): Promise<Dtos.PCRItemTypeDto[]> {
    const itemTypeDtos = await context.runQuery(new GetPCRItemTypesQuery(this.projectId));
    const projectPcrs = await context.runQuery(new GetAllPCRsQuery(this.projectId));

    const editingPcr = projectPcrs.find(pcr => pcr.id === this.pcrId);

    const disabledMatrixTypes = getUnavailablePcrItemsMatrix(projectPcrs);
    const currentPcrItemTypes = getUnduplicatablePcrItemsMatrix(editingPcr);

    const disabledTypes = [...currentPcrItemTypes, ...disabledMatrixTypes];

    return itemTypeDtos.reduce<Dtos.PCRItemTypeDto[]>((validPcrItems, pcrItem) => {
      // Note: Include items that are only true
      if (!pcrItem.enabled) return validPcrItems;

      const disabled = disabledTypes.some(disabledType => disabledType === pcrItem.type);

      return validPcrItems.concat({ ...pcrItem, disabled });
    }, []);
  }
}
