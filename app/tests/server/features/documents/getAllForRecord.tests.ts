import {TestContext} from "../../testContextProvider";
import {GetAllClaimDetailsByPartner} from "../../../../src/server/features/claims/claimDetails/getAllByPartnerQuery";
import {GetDocumentsLinkedToRecordQuery} from "../../../../src/server/features/documents/getAllForRecord";

describe("GetClaimDetailDocumentsQuery", () => {
  it("returns objects of correct shape", async () => {
    const context = new TestContext();
    const contentVersion = context.testData.createContentVersion("12345", "cat", "jpg");
    context.testData.createContentDocumentLink(contentVersion.ContentDocumentId, "12345");

    const query = new GetDocumentsLinkedToRecordQuery("12345");
    const result = await context.runQuery(query);
    const item = result[0];

    expect(item.title).toBe("cat.jpg");
    expect(item.link).toBe("#");
  });
});
