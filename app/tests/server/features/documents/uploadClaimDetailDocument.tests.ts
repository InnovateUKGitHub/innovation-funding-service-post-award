import { TestContext } from "../../testContextProvider";
import { UploadClaimDetailDocumentCommand } from "@server/features/documents/uploadClaimDetailDocument";
import { BadRequestError, ValidationError } from "@server/features/common/appError";

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
      content: "Some content1",
    };

    const command = new UploadClaimDetailDocumentCommand(claimDetailKey, file);
    await context.runCommand(command);

    expect(context.repositories.contentVersions.Items[0].VersionData).toEqual(file.content);
    expect(context.repositories.contentVersions.Items[0].PathOnClient).toEqual(file.fileName);
    expect(context.repositories.contentDocumentLinks.Items[0].LinkedEntityId).toEqual(claimDetail.Id);
  });

  test("invalid filename should throw a validation exception", async () => {
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
      fileName: undefined,
      content: "Some content2",
    };

    const command = new UploadClaimDetailDocumentCommand(claimDetailKey, file as any);
    await expect(context.runCommand(command)).rejects.toThrow(ValidationError);
  });

  test("invalid claimDetailKey should throw exception", async () => {
    const context = new TestContext();

    const claimDetailKey = {
      partnerId: "",
      periodId: "",
      costCategoryId: ""
    };

    const file = {
      fileName: "undefined.txt",
      content: "Some content3",
    };

    const command = new UploadClaimDetailDocumentCommand(claimDetailKey as any, file as any);
    await expect(context.runCommand(command)).rejects.toThrow(BadRequestError);
  });
});
