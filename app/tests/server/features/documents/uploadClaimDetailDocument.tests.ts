import {TestContext} from "../../testContextProvider";
import {UploadClaimDetailDocumentCommand} from "../../../../src/server/features/documents/uploadClaimDetailDocument";

describe("UploadClaimDetailDocumentCommand", () => {
  it("should", async () => {
    const context = new TestContext();
    const costCat = context.testData.createCostCategory();
    const partner = context.testData.createPartner();
    const claimDetail = context.testData.createClaimDetail(costCat, partner);

    const claimDetailKey = {
      partnerId: claimDetail.Acc_ProjectParticipant__c,
      periodId: claimDetail.Acc_ProjectPeriodNumber__c,
      costCategoryId: claimDetail.Acc_CostCategory__c,
    };
    const content = "Some content";
    const fileName = "fileName.txt";

    const command = new UploadClaimDetailDocumentCommand(claimDetailKey, content, fileName);
    await context.runCommand(command);

    expect(context.repositories.contentVersions.Items[0].VersionData).toEqual(content);
    expect(context.repositories.contentVersions.Items[0].PathOnClient).toEqual(fileName);
    expect(context.repositories.contentDocumentLinks.Items[0].LinkedEntityId).toEqual(claimDetail.Id);

  });
});
