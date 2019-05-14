import { TestContext } from "../../testContextProvider";
import { GetClaimDocumentsQuery } from "@server/features/documents/getClaimDocuments";
import { DocumentDescription } from "@framework/constants";

describe("GetClaimDocumentQuery", () => {
  it("should return all the documents when there is no filter", async () => {
    const context = new TestContext();

    context.testData.createDocument("12345", "cat", "jpg");
    context.testData.createDocument("12345", "cat", "jpg", DocumentDescription.IAR);

    const partner = context.testData.createPartner();
    const claim = context.testData.createClaim(partner, 1, (item) => {
      item.Id = "12345";
    });

    const claimKey = {
      partnerId: claim.Acc_ProjectParticipant__r.Id,
      periodId: claim.Acc_ProjectPeriodNumber__c
    };

    const query = new GetClaimDocumentsQuery(claimKey);
    const docs = await context.runQuery(query);
    expect(docs).toHaveLength(2);
  });
  it("should return only the relevant documents when there is a filter", async () => {
    const context = new TestContext();

    context.testData.createDocument("12345", "cat1", "jpg");
    context.testData.createDocument("12345", "cat2", "jpg", "hello world", DocumentDescription.IAR);

    const partner = context.testData.createPartner();
    const claim = context.testData.createClaim(partner, 1, (item) => {
      item.Id = "12345";
    });

    const claimKey = {
      partnerId: claim.Acc_ProjectParticipant__r.Id,
      periodId: claim.Acc_ProjectPeriodNumber__c
    };
    const query = new GetClaimDocumentsQuery(claimKey, { description: DocumentDescription.IAR });
    const docs = await context.runQuery(query);
    expect(docs).toHaveLength(1);
    expect(docs[0].description).toBe(DocumentDescription.IAR);
  });
});
