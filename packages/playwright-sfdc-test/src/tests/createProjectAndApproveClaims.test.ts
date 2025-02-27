import { test, expect } from "../fixtures";
import fs from "fs";
import path from "path";
import { Fixture, Given } from "playwright-bdd/decorators";
type QueryResponse = {
  totalSize: number;
  done: boolean;
  records: {
    attributes: { type: string; url: string };
    Id: string;
    CreatedById: string;
    CreatedDate: string;
    Acc_ClaimFrequency__c: string;
    Acc_CurrentPeriodNumber__c: number;
  }[];
};

test("Testing a connection to Salesforce", { tag: ["@debug"] }, async ({ sfdcApi }) => {
  const conn = await sfdcApi.getTsforceConnection();

  await conn.executeApex({ query: "System.debug('Steven Killen says hi!');" });
  const apexresponse = await conn.executeApex({
    query: fs.readFileSync(path.join(__dirname, "../apex/createCRnDProject.apex"), { encoding: "utf-8" }),
  });

  // Get the Project Id
  const response: QueryResponse = await conn.executeSOQL({
    query:
      "SELECT Id,CreatedById,CreatedDate,Acc_ClaimFrequency__c,Acc_CurrentPeriodNumber__c FROM Acc_Project__c ORDER BY createdDate desc LIMIT 1",
  });
  //console.log(projectId);

  const myJSON = JSON.stringify(response);
  //console.log(myJSON);
  const projectId = response.records[0].Id;
  //console.log(projectId);

  console.log(apexresponse);
});

const x = {
  totalSize: 1,
  done: true,
  records: [
    {
      attributes: { type: "Acc_Project__c", url: "/services/data/v60.0/sobjects/Acc_Project__c/a0EPt000003dgQfMAI" },
      Id: "a0EPt000003dgQfMAI",
      CreatedById: "0054I000004ujXCQAY",
      CreatedDate: "2025-02-26T16:24:11.000+0000",
      Acc_ClaimFrequency__c: "Monthly",
      Acc_CurrentPeriodNumber__c: null,
    },
  ],
};
