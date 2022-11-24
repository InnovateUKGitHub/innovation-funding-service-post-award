import { GetJesAccountsByNameQuery } from "@server/features/accounts/getJesAccountsByName";
import { ISalesforceAccount } from "@server/repositories/accountsRepository";
import { TestContext } from "@tests/test-utils/testContextProvider";

describe("accounts", () => {
  describe("no search name provided", () => {
    test("should return all JES organisations", async () => {
      const stubName = "First jes account";
      const context = new TestContext();
      context.testData.createAccount({ Name: stubName, JES_Organisation__c: "Yes" } as ISalesforceAccount);
      context.testData.createAccount({ Name: "second jes account", JES_Organisation__c: "Yes" } as ISalesforceAccount);
      context.testData.createAccount();
      context.testData.createAccount();

      const query = new GetJesAccountsByNameQuery();
      const result = await context.runQuery(query);

      expect(result).toHaveLength(2);
      const expectedJesAccount = result.find(x => x.companyName === stubName);
      expect(expectedJesAccount).toBeDefined();
    });
  });

  describe("search name provided", () => {
    test("should return JES organisations that match the provided name", async () => {
      const context = new TestContext();
      context.testData.createAccount({ JES_Organisation__c: "Yes" } as ISalesforceAccount);
      context.testData.createAccount({ JES_Organisation__c: "Yes" } as ISalesforceAccount);
      context.testData.createAccount();
      context.testData.createAccount();

      const query = new GetJesAccountsByNameQuery("test");
      const result = await context.runQuery(query);

      expect(result).toHaveLength(2);
    });

    test("should not return any JES organisations that don't match the provided name", async () => {
      const context = new TestContext();
      context.testData.createAccount({ JES_Organisation__c: "Yes" } as ISalesforceAccount);
      context.testData.createAccount({ JES_Organisation__c: "Yes" } as ISalesforceAccount);
      context.testData.createAccount();
      context.testData.createAccount();

      const query = new GetJesAccountsByNameQuery("non_existent_name");
      const result = await context.runQuery(query);

      expect(result).toHaveLength(0);
    });
  });
});
