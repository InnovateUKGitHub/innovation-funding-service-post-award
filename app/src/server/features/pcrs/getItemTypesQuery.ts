import { pcrItemTypes } from "@framework/constants/pcrConstants";
import { PCRItemTypeDto } from "@framework/dtos/pcrDtos";
import { IContext } from "@framework/types/IContext";
import { AuthorisedAsyncQueryBase } from "../common/queryBase";
import { GetByIdQuery } from "../projects/getDetailsByIdQuery";
import { GetAllPCRItemTypesQuery } from "./getAllItemTypesQuery";
import { mapToSalesforceCompetitionTypes } from "@framework/constants/competitionTypes";

export class GetPCRItemTypesQuery extends AuthorisedAsyncQueryBase<PCRItemTypeDto[]> {
  public readonly runnableName: string = "GetPCRItemTypesQuery";
  constructor(public readonly projectId: ProjectId) {
    super();
  }

  protected async run(context: IContext): Promise<PCRItemTypeDto[]> {
    const itemTypes = await context.runQuery(new GetAllPCRItemTypesQuery(this.projectId));
    const { competitionType: typeString } = await context.runQuery(new GetByIdQuery(this.projectId));
    const competitionType = mapToSalesforceCompetitionTypes(typeString);

    return itemTypes.filter(x => {
      const pcrItem = pcrItemTypes.find(y => y.type === x.type);

      if (!pcrItem) return false;
      return !pcrItem.ignoredCompetitions.includes(competitionType);
    });
  }
}
