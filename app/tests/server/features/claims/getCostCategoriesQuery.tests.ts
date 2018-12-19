import { TestContext } from "../../testContextProvider";
import { GetCostCategoriesQuery } from "../../../../src/server/features/claims";

describe('GetCostCategoriesQuery', () => {
    it('when valid then returns all categories', async () => {
        let context = new TestContext();
        let testData = context.testData;

        testData.range(5, _ => testData.createCostCategory())

        let query = new GetCostCategoriesQuery();

        let result = await context.runQuery(query);

        expect(result.length).toBe(5)
    });

    it("Correctly maps organistionType",  async () =>{
        let context = new TestContext();
        
        let data = context.testData.range(3, () => context.testData.createCostCategory());
        data[0].Acc_OrganisationType__c = "xxxx";
        data[1].Acc_OrganisationType__c = "Industrial";
        data[2].Acc_OrganisationType__c = "Academic";

        let query = new GetCostCategoriesQuery();
        let result = await context.runQuery(query);
        
        expect(result.length).toBe(3);
        expect(result[0].organistionType).toBe("Unknown");
        expect(result[1].organistionType).toBe("Industrial");
        expect(result[2].organistionType).toBe("Academic");
    });

    it("Sorts by display order", async () =>{
        const context = new TestContext();
        const data = context.testData.range(5, (i) => context.testData.createCostCategory(x => { 
            const order = 5 + 1 - i;
            x.Acc_DisplayOrder__c = order;
            x.Acc_CostCategoryName__c = "Item " + order
        }));

        let query = new GetCostCategoriesQuery();
        let result = await context.runQuery(query);
        
        expect(result.length).toBe(5);
        expect(data.map(x => x.Acc_CostCategoryName__c)).toEqual(["Item 5", "Item 4", "Item 3", "Item 2", "Item 1"]);
        expect(result.map(x => x.name)).toEqual(["Item 1", "Item 2", "Item 3", "Item 4", "Item 5"]);

    });

});
