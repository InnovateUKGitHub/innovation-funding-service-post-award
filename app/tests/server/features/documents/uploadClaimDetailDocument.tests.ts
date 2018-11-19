import {TestContext} from "../../testContextProvider";
import {UploadClaimDetailDocumentCommand} from "../../../../src/server/features/documents/uploadClaimDetailDocument";

describe("UploadClaimDetailDocumentCommand", () => {
  it("should upload a claim detail document", async () => {
    const context = new TestContext();
    const costCat = context.testData.createCostCategory();
    const partner = context.testData.createPartner();
    const claimDetail = context.testData.createClaimDetail(costCat, partner);

    const claimDetailKey = {
      partnerId: claimDetail.Acc_ProjectParticipant__c,
      periodId: claimDetail.Acc_ProjectPeriodNumber__c,
      costCategoryId: claimDetail.Acc_CostCategory__c,
    };

    const file = {
      fileName: "fileName.txt",
      content: "Some content",
    };

    const command = new UploadClaimDetailDocumentCommand(claimDetailKey, file);
    await context.runCommand(command);

    expect(context.repositories.contentVersions.Items[0].VersionData).toEqual(file.content);
    expect(context.repositories.contentVersions.Items[0].PathOnClient).toEqual(file.fileName);
    expect(context.repositories.contentDocumentLinks.Items[0].LinkedEntityId).toEqual(claimDetail.Id);

  });
});
