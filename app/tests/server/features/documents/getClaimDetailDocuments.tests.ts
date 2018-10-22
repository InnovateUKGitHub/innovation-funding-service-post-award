import {TestContext} from "../../testContextProvider";
import {GetClaimDetailDocumentsQuery} from "../../../../src/server/features/documents/getClaimDetailDocuments";

describe("GetClaimDetailDocumentsQuery", () => {
  it("returns objects of correct shape", async () => {
    const context = new TestContext();
    const claimDetail = context.testData.createClaimDetail();
    const contentVersion = context.testData.createContentVersion(claimDetail.Id, "cat", "jpg");
    context.testData.createContentDocumentLink(contentVersion.ContentDocumentId, claimDetail.Id);

    const query = new GetClaimDetailDocumentsQuery(claimDetail.Acc_ProjectParticipant__c, claimDetail.Acc_ProjectPeriodNumber__c, claimDetail.Acc_CostCategory__c);
    const result = await context.runQuery(query);
    const item = result[0];

    expect(item.title).toBe("cat.jpg");
    expect(item.link).toBe("#");
  });
});
