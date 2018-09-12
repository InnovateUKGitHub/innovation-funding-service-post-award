import SalesforceBase from "./salesforceBase";
import { range } from "../../shared/range";

export interface ISalesforceCostCategory {
    Id: string;
    Acc_CostCategoryName__c: string;
    Acc_CostCategoryDescption__c: string;
    Acc_CostCategoryID__c: number;
    Acc_DisplayOrder__c: number;
}

const fieldNames: string[] = [];

export interface ICostCategoryRepository {
    getAll(): Promise<ISalesforceCostCategory[]>;
}

const fakeCCNames = ["Labour", "Overheads", "Materials", "Capital usage", "Subcontracting", "Travel and subsistence", "Other costs" ];

export class CostCategoryRepository extends SalesforceBase<ISalesforceCostCategory> implements ICostCategoryRepository {
    constructor(){
        super("TODO", fieldNames);
    }

    getAll(): Promise<ISalesforceCostCategory[]> {
        return Promise.resolve(fakeCCNames.map((name, index) => this.createDummyCostCategory(index + 1, name)));
    }

    createDummyCostCategory(seed: number, name: string): ISalesforceCostCategory {
        return {
            Id: `CostCategory${seed}`,
            Acc_CostCategoryID__c: seed,
            Acc_DisplayOrder__c: seed - 1,
            Acc_CostCategoryName__c: name,
            Acc_CostCategoryDescption__c: `The description for Cost Category ${seed}:${name}`
        };
    }
    
}
