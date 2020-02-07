import { TestContext } from "../../testContextProvider";
import { UploadClaimDetailDocumentCommand } from "@server/features/documents/uploadClaimDetailDocument";
import { BadRequestError, ValidationError } from "@server/features/common/appError";
import { Authorisation, ProjectRole } from "@framework/types";

describe("UploadClaimDetailDocumentCommand", () => {
  it("should upload a claim detail document", async () => {
    const context = new TestContext();
    const costCat = context.testData.createCostCategory();
    const project = context.testData.createProject();
    const partner = context.testData.createPartner();
    const claimDetail = context.testData.createClaimDetail(project, costCat, partner, 1);

    const claimDetailKey = {
      projectId: project.Id,
      partnerId: claimDetail.Acc_ProjectParticipant__r.Id,
      periodId: claimDetail.Acc_ProjectPeriodNumber__c,
      costCategoryId: claimDetail.Acc_CostCategory__c,
    };

    const expectedContent = "Some content1";
    const expectedFileName = "fileName.txt";

    const file = context.testData.createFile(expectedContent, expectedFileName);

    const command = new UploadClaimDetailDocumentCommand(claimDetailKey, { files : [file] });
    const documentId = await context.runCommand(command);
    const document = await context.repositories.documents.getDocumentMetadata(documentId[0]);

    expect(document.VersionData).toEqual(file.content);
    expect(document.PathOnClient).toEqual(file.fileName);
  });

  it("should upload multiple documents", async () => {
    const context = new TestContext();
    const costCat = context.testData.createCostCategory();
    const project = context.testData.createProject();
    const partner = context.testData.createPartner();
    const claimDetail = context.testData.createClaimDetail(project, costCat, partner, 1);

    const claimDetailKey = {
      projectId: project.Id,
      partnerId: claimDetail.Acc_ProjectParticipant__r.Id,
      periodId: claimDetail.Acc_ProjectPeriodNumber__c,
      costCategoryId: claimDetail.Acc_CostCategory__c,
    };

    const files = context.testData.range(3, () => context.testData.createFile());

    const command = new UploadClaimDetailDocumentCommand(claimDetailKey, { files });
    const documentIds = await context.runCommand(command);

    expect(documentIds.length).toBe(3);

    // check stored docs
    const documents = await context.repositories.documents.Items.map(x => x[1]);
    expect(documents.map(x => x.VersionData)).toEqual(files.map(x => x.content));
    expect(documents.map(x => x.PathOnClient)).toEqual(files.map(x => x.fileName));
  });

  test("invalid filename should throw a validation exception", async () => {
    const context = new TestContext();
    const costCat = context.testData.createCostCategory();
    const partner = context.testData.createPartner();
    const project = context.testData.createProject();
    const claimDetail = context.testData.createClaimDetail(project, costCat, partner);

    const claimDetailKey = {
      projectId: project.Id,
      partnerId: claimDetail.Acc_ProjectParticipant__r.Id,
      periodId: claimDetail.Acc_ProjectPeriodNumber__c,
      costCategoryId: claimDetail.Acc_CostCategory__c,
    };

    const file = context.testData.createFile();

    file.fileName = "";
    const commandNoFilename = new UploadClaimDetailDocumentCommand(claimDetailKey, {files: [file]});
    await expect(context.runCommand(commandNoFilename)).rejects.toThrow(ValidationError);

    file.fileName = "NotValid.zip";
    const commandInvalidFiletype = new UploadClaimDetailDocumentCommand(claimDetailKey, {files: [file]});
    await expect(context.runCommand(commandInvalidFiletype)).rejects.toThrow(ValidationError);
  });

  test("invalid claimDetailKey should throw exception", async () => {
    const context = new TestContext();

    const claimDetailKey = {
      projectId: "",
      partnerId: "",
      periodId: NaN,
      costCategoryId: ""
    };

    const file = context.testData.createFile();

    const command = new UploadClaimDetailDocumentCommand(claimDetailKey, {files: [file]});
    await expect(context.runCommand(command)).rejects.toThrow(BadRequestError);
  });

  describe("access control", () => {

    const setupAccessControlContext = () => {
      const context = new TestContext();
      const project  = context.testData.createProject();
      const partner  = context.testData.createPartner(project);
      const costCat  = context.testData.createCostCategory();
      const claimDto = context.testData.createClaim(partner);
      const claimDetail = context.testData.createClaimDetail(project, costCat, partner );

      const claimDetailKey = {
        projectId: project.Id,
        partnerId: claimDetail.Acc_ProjectParticipant__r.Id,
        periodId: claimDetail.Acc_ProjectPeriodNumber__c,
        costCategoryId: claimDetail.Acc_CostCategory__c,
      };

      const file = context.testData.createFile();

      const command = new UploadClaimDetailDocumentCommand(claimDetailKey, { files: [file] });

      return { command, project, claimDto, context };
    };

    test("accessControl - Finance Contact can upload documents", async () => {

      const { command, project, claimDto, context } = setupAccessControlContext();

      const auth     = new Authorisation({
        [project.Id]: {
          projectRoles: ProjectRole.FinancialContact,
          partnerRoles: { [claimDto.Acc_ProjectParticipant__r.Id]: ProjectRole.FinancialContact}
        }
      });

      expect(await context.runAccessControl(auth, command)).toBe(true);
    });

    test("accessControl - All other roles are restricted", async () => {
      const { command, project, claimDto, context } = setupAccessControlContext();

      const auth     = new Authorisation({
        [project.Id]: {
          projectRoles: ProjectRole.ProjectManager | ProjectRole.MonitoringOfficer | ProjectRole.FinancialContact,
          partnerRoles: { [claimDto.Acc_ProjectParticipant__r.Id]: ProjectRole.ProjectManager | ProjectRole.MonitoringOfficer }
        }
      });

      expect(await context.runAccessControl(auth, command)).toBe(false);
    });
  });
});
