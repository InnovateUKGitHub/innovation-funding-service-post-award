import { QueryBase, SyncQueryBase } from "../common";
import { PCRItemTypeDto } from "@framework/dtos/pcrDtos";
import { IContext } from "@framework/types";
import { PCRItemType } from "@framework/entities";
import { isNumber } from "util";
import { numberComparator } from "@framework/util";

const metavalues = [
  { id: PCRItemType.FinancialVirement, name: "Financial Virement", order: 1 },
  { id: PCRItemType.PartnerAddition, name: "Partner Addition", order: 2 },
  { id: PCRItemType.PartnerWithdrawal, name: "Partner Withdrawal", order: 3 },
  { id: PCRItemType.TimeExtension, name: "Time Extension", order: 4 },
  { id: PCRItemType.ProjectSuspension, name: "Project Suspension", order: 5 },
  { id: PCRItemType.ScopeChange, name: "Scope Change", order: 6 },
  { id: PCRItemType.ProjectTermination, name: "Project Termination", order: 7 },
];

export class GetPCRItemTypesQuery extends SyncQueryBase<PCRItemTypeDto[]> {
  protected Run(context: IContext): PCRItemTypeDto[] {
    const result = [...metavalues];

    result.sort((a,b) => numberComparator(a.order, b.order));

    return result;
  }
}
