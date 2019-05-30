import { TestContext } from "../../testContextProvider";
import { UploadClaimDetailDocumentCommand } from "@server/features/documents/uploadClaimDetailDocument";
import { BadRequestError, ValidationError } from "@server/features/common/appError";
import { Authorisation, ProjectRole } from "@framework/types";
import { ISalesforceClaim, ISalesforceClaimDetails, ISalesforceProject } from "@server/repositories";

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
        partnerId: claimDetail.Acc_ProjectParticipant__c,
        periodId: claimDetail.Acc_ProjectPeriodNumber__c,
        costCategoryId: claimDetail.Acc_CostCategory__c,
      };

      const file = {
        fileName: "fileNameA.txt",
        content: "Some content 2",
      };

      const command = new UploadClaimDetailDocumentCommand(claimDetailKey, file);

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
