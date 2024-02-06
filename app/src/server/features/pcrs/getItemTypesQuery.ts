import { pcrItemTypes } from "@framework/constants/pcrConstants";
import { PCRItemTypeDto } from "@framework/dtos/pcrDtos";
import { IContext } from "@framework/types/IContext";
import { QueryBase } from "../common/queryBase";
import { GetByIdQuery } from "../projects/getDetailsByIdQuery";
import { GetAllPCRItemTypesQuery } from "./getAllItemTypesQuery";

export class GetPCRItemTypesQuery extends QueryBase<PCRItemTypeDto[]> {
  constructor(public readonly projectId: ProjectId) {
    super();
  }

  protected async run(context: IContext): Promise<PCRItemTypeDto[]> {
    const itemTypes = await context.runQuery(new GetAllPCRItemTypesQuery(this.projectId));
    const { competitionType } = await context.runQuery(new GetByIdQuery(this.projectId));

    return itemTypes.filter(x => {
      const pcrItem = pcrItemTypes.find(y => y.type === x.type);

      if (!pcrItem) return false;
      return !pcrItem.ignoredCompetitions.includes(competitionType);
    });
  }
}
