import { TestContext } from "../../testContextProvider";
import { UploadClaimDetailDocumentCommand } from "@server/features/documents/uploadClaimDetailDocument";
import { BadRequestError, ValidationError } from "@server/features/common/appError";

describe("UploadClaimDetailDocumentCommand", () => {
  it("should upload a claim detail document", async () => {
    const context = new TestContext();
    const costCat = context.testData.createCostCategory();
    const project = context.testData.createProject();
    const partner = context.testData.createPartner();
    const claimDetail = context.testData.createClaimDetail(project, costCat, partner, 1);

    const claimDetailKey = {
      projectId: project.Id,
      partnerId: claimDetail.Acc_ProjectParticipant__c,
      periodId: claimDetail.Acc_ProjectPeriodNumber__c,
      costCategoryId: claimDetail.Acc_CostCategory__c,
    };

    const file = {
      fileName: "fileName.txt",
      content: "Some content1",
    };

    const command = new UploadClaimDetailDocumentCommand(claimDetailKey, file);
    const documentId = await context.runCommand(command);
    const document = await context.repositories.documents.getDocumentMetadata(documentId);

    expect(document.VersionData).toEqual(file.content);
    expect(document.PathOnClient).toEqual(file.fileName);
  });

  test("invalid filename should throw a validation exception", async () => {
    const context = new TestContext();
    const costCat = context.testData.createCostCategory();
    const partner = context.testData.createPartner();
    const project = context.testData.createProject();
    const claimDetail = context.testData.createClaimDetail(project, costCat, partner);

    const claimDetailKey = {
      projectId: project.Id,
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
