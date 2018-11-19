import { TestContext } from "../../testContextProvider";
import { GetClaimDocumentsQuery } from "../../../../src/server/features/documents/getClaimDocuments";
import { ClaimStatus, DocumentDescription } from "../../../../src/types/constants";

describe("GetClaimDocumentQuery", () => {
  it("should return all the documents when there is no filter", async () => {
    const context = new TestContext();

    const contentVersion1 = context.testData.createContentVersion("12345", "cat", "jpg");
    context.testData.createContentDocumentLink(contentVersion1.ContentDocumentId, "12345");

    const contentVersion2 = context.testData.createContentVersion("12345", "cat", "jpg", DocumentDescription.IAR);
    context.testData.createContentDocumentLink(contentVersion2.ContentDocumentId, "12345");

    const partner = context.testData.createPartner();
    const claim = context.testData.createClaim(partner, 1, (item) => {
      item.Id = "12345";
    });

    const claimKey = {
      partnerId: claim.Acc_ProjectParticipant__c,
      periodId: claim.Acc_ProjectPeriodNumber__c
    };

    const query = new GetClaimDocumentsQuery(claimKey);
    const docs = await context.runCommand(query);
    expect(docs).toHaveLength(2);
  });
  it("should return only the relevant documents when there is a filter", async () => {
    const context = new TestContext();

    const contentVersion1 = context.testData.createContentVersion("12345", "cat1", "jpg");
    context.testData.createContentDocumentLink(contentVersion1.ContentDocumentId, "12345");

    const contentVersion2 = context.testData.createContentVersion("12345", "cat2", "jpg", "hello world", DocumentDescription.IAR);
    context.testData.createContentDocumentLink(contentVersion2.ContentDocumentId, "12345");

    const partner = context.testData.createPartner();
    const claim = context.testData.createClaim(partner, 1, (item) => {
      item.Id = "12345";
    });

    const claimKey = {
      partnerId: claim.Acc_ProjectParticipant__c,
      periodId: claim.Acc_ProjectPeriodNumber__c
    };
    const query = new GetClaimDocumentsQuery(claimKey, { description: DocumentDescription.IAR });
    const docs = await context.runCommand(query);
    expect(docs).toHaveLength(1);
    expect(docs[0].description).toBe(DocumentDescription.IAR);
  });
});
