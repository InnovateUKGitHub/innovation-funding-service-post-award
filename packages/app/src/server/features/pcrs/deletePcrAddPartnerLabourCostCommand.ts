import { ProjectRolePermissionBits } from "@framework/constants/project";
import { Authorisation } from "@framework/types/authorisation";
import { IContext } from "@framework/types/IContext";
import { AuthorisedAsyncCommandBase } from "../common/commandBase";
import { GetUnfilteredCostCategoriesQuery } from "../claims/getCostCategoriesQuery";
import { PCRSpendProfileOverheadRate } from "@framework/constants/pcrConstants";
import { sumBy } from "lodash";
import { roundCurrency } from "@framework/util/numberHelper";

export class DeleteLabourCostCommand extends AuthorisedAsyncCommandBase<boolean> {
  public readonly runnableName: string = "DeleteLabourCostCommand";
  constructor(
    private readonly projectId: ProjectId,
    private readonly pcrId: PcrId,
    private readonly pcrItemId: PcrItemId,
    private readonly costId: CostId,
  ) {
    super();
  }

  async accessControl(auth: Authorisation) {
    return auth.forProject(this.projectId).hasRole(ProjectRolePermissionBits.ProjectManager);
  }

  protected async run(context: IContext) {
    await context.repositories.pcrSpendProfile.deleteSingleItem(this.costId);

    /**
     * TODO: after overhead recalculation shifted to salesforce side, deprecate this special case logic
     */
    const costCategories = await context.runQuery(new GetUnfilteredCostCategoriesQuery());
    const overheadCategoryIds = costCategories.filter(x => x.type === 5).map(x => x.id);
    const labourCostCategoryIds = costCategories.filter(x => x.type === 3).map(x => x.id);
    const spendProfile = await context.repositories.pcrSpendProfile.getAllForPcr(this.projectId, this.pcrItemId);
    const overheadItem = spendProfile.find(x => overheadCategoryIds.includes(x.costCategoryId));

    const labourItems = spendProfile.filter(x => labourCostCategoryIds.includes(x.costCategoryId));

    if (!overheadItem || overheadItem.overheadRate !== PCRSpendProfileOverheadRate.Twenty) {
      return true;
    }
    const labourTotal = sumBy(labourItems, x => x.value ?? 0);

    await context.repositories.pcrSpendProfile.updateSingleItem({
      Id: overheadItem.id,
      Acc_TotalCost__c: roundCurrency(labourTotal * 0.2),
    });

    return true;
  }
}
