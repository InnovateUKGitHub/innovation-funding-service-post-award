import { test, expect } from "../fixtures";

test("Testing a connection to Salesforce", { tag: ["@debug"] }, async ({ sfdcApi }) => {
  const conn = await sfdcApi.getTsforceConnection();

  await conn.executeApex({ query: "System.debug('Steven Killen says hi!');" });

  const data = await conn.executeSOQL({ query: "SELECT Id FROM Acc_MonitoringQuestion__c" });
  expect(data.totalSize).toBeGreaterThan(-1);
});
