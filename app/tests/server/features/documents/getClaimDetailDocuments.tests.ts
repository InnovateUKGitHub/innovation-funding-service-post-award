import { TestContext } from "../../testContextProvider";
import { GetClaimDetailDocumentsQuery } from "@server/features/documents/getClaimDetailDocuments";

describe("GetClaimDetailDocumentsQuery", () => {
  it("returns objects of correct shape", async () => {
    const context = new TestContext();
    const claimDetail = context.testData.createClaimDetail();
    const document = context.testData.createDocument(claimDetail.Id, "cat", "jpg");

    const query = new GetClaimDetailDocumentsQuery(claimDetail.Acc_ProjectParticipant__c, claimDetail.Acc_ProjectPeriodNumber__c, claimDetail.Acc_CostCategory__c);
    const result = await context.runQuery(query);
    const item = result[0];

    expect(item.fileName).toBe("cat.jpg");
    expect(item.link).toBe(`/api/documents/${document.Id}/content`);
    expect(item.id).toBe(document.ContentDocumentId);
  });

  it("returns empty array if no claim detail", async () => {
    const context = new TestContext();
    const query = new GetClaimDetailDocumentsQuery("", 1, "");
    const result = await context.runQuery(query);

    expect(result).toBeInstanceOf(Array);
    expect(result.length).toBe(0);
  });
});
