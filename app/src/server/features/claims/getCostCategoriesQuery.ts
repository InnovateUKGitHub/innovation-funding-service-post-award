import { IContext, IQuery } from "../common/context";
import { CostCategoryDto } from "../../../ui/models/costCategoryDto";

export class GetCostCategoriesQuery implements IQuery<CostCategoryDto[]> {
    public async Run(context: IContext){
        const data = await context.repositories.costCategories.getAll() || [];
        
        data.sort((a,b) => a.Acc_DisplayOrder__c - b.Acc_DisplayOrder__c);
        
        return (data || []).map<CostCategoryDto>(x => ({
            id: x.Acc_CostCategoryID__c,
            name: x.Acc_CostCategoryName__c
        }));
    };

}
