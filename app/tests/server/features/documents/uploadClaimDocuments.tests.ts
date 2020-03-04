import { TestContext } from "../../testContextProvider";
import { ValidationError } from "@server/features/common/appError";
import { DocumentDescription } from "@framework/constants";
import { Authorisation, ProjectRole } from "@framework/types";
import { UploadClaimDocumentsCommand } from "@server/features/documents/uploadClaimDocuments";

describe("UploadClaimDocumentsCommand", () => {
  it("should upload a single document ", async () => {
    const context = new TestContext();
    const partner = context.testData.createPartner();
    const project = context.testData.createProject();
    const claim = context.testData.createClaim(partner, 1);

    const claimKey = {
      projectId: project.Id,
      partnerId: claim.Acc_ProjectParticipant__r.Id,
      periodId: claim.Acc_ProjectPeriodNumber__c
    };

    const expectedContent = "Some content 2";
    const expectedFileName = "fileName.txt";

    const file = context.testData.createFile(expectedContent, expectedFileName);

    const command = new UploadClaimDocumentsCommand(claimKey,{ files: [file] });
    const documentId = await context.runCommand(command);
    const document = await context.repositories.documents.getDocumentMetadata(documentId[0]);

    expect(document.VersionData).toEqual(file.content);
    expect(document.PathOnClient).toEqual(file.fileName);
  });

  it("should upload multiple documents ", async () => {
    const context = new TestContext();
    const partner = context.testData.createPartner();
    const project = context.testData.createProject();
    const claim = context.testData.createClaim(partner, 1);

    const claimKey = {
      projectId: project.Id,
      partnerId: claim.Acc_ProjectParticipant__r.Id,
      periodId: claim.Acc_ProjectPeriodNumber__c
    };

    const files = context.testData.range(3, () => context.testData.createFile());

    const command = new UploadClaimDocumentsCommand(claimKey,{ files });
    const documentIds = await context.runCommand(command);

    expect(documentIds.length).toEqual(3);

    const documents = await context.repositories.documents.Items.map(x => x[1]);
    expect(documents.map(x => x.VersionData)).toEqual(files.map(x => x.content));
    expect(documents.map(x => x.PathOnClient)).toEqual(files.map(x => x.fileName));
  });

  it("should throw a validation error if the file type is not allowed", async () => {
    const context = new TestContext();
    const partner = context.testData.createPartner();
    const project = context.testData.createProject();
    const claim = context.testData.createClaim(partner, 1);

    const claimKey = {
      projectId: project.Id,
      partnerId: claim.Acc_ProjectParticipant__r.Id,
      periodId: claim.Acc_ProjectPeriodNumber__c
    };

    const expectedContent = "Some content";
    const expectedFileName = "fileName.zip";

    const file = context.testData.createFile(expectedContent, expectedFileName);
    const command = new UploadClaimDocumentsCommand(claimKey,{ files: [file] });
    await expect(context.runCommand(command)).rejects.toThrow(ValidationError);
  });

  it("should throw an exception if file upload validation fails", async () => {
    const context = new TestContext();
    const partner = context.testData.createPartner();
    const project = context.testData.createProject();
    const claim = context.testData.createClaim(partner, 1);

    const badFile = {
      fileName: undefined,
      content: "Some content",
      description: DocumentDescription.IAR
    };

    const claimKey = {
      projectId: project.Id,
      partnerId: claim.Acc_ProjectParticipant__r.Id,
      periodId: claim.Acc_ProjectPeriodNumber__c
    };

    const command = new UploadClaimDocumentsCommand(claimKey, badFile as any);
    await expect(context.runCommand(command)).rejects.toThrow(ValidationError);
  });

  describe("access control", () => {

    const setupAccessControlContext = () => {
      const context = new TestContext();
      const project = context.testData.createProject();
      const partner = context.testData.createPartner(project);
      const claim = context.testData.createClaim(partner);

      const claimKey = {
        projectId: project.Id,
        partnerId: partner.Id,
        periodId: 1,
      };

      const file = context.testData.createFile();

      const command = new UploadClaimDocumentsCommand(claimKey, { files: [file] });

      return {command, project, claim, context};
    };

    test("accessControl - FC can upload documents for their claim", async () => {
      const {command, project, claim, context} = setupAccessControlContext();

      const auth = new Authorisation({
        [project.Id]: {
          projectRoles: ProjectRole.FinancialContact,
          partnerRoles: {[claim.Acc_ProjectParticipant__r.Id]: ProjectRole.FinancialContact | ProjectRole.ProjectManager | ProjectRole.MonitoringOfficer}
        }
      });

      expect(await context.runAccessControl(auth, command)).toBe(true);
    });

    test("accessControl - MO can upload documents for claim review", async () => {
      const {command, project, claim, context} = setupAccessControlContext();

      const auth = new Authorisation({
        [project.Id]: {
          projectRoles: ProjectRole.MonitoringOfficer,
          partnerRoles: {[claim.Acc_ProjectParticipant__r.Id]: ProjectRole.FinancialContact | ProjectRole.ProjectManager | ProjectRole.MonitoringOfficer}
        }
      });

      expect(await context.runAccessControl(auth, command)).toBe(true);
    });

    test("accessControl - All other roles are restricted", async () => {
      const {command, project, claim, context} = setupAccessControlContext();

      const auth = new Authorisation({
        [project.Id]: {
          projectRoles: ProjectRole.ProjectManager | ProjectRole.MonitoringOfficer | ProjectRole.FinancialContact,
          partnerRoles: {[claim.Acc_ProjectParticipant__r.Id]: ProjectRole.ProjectManager | ProjectRole.Unknown}
        }
      });

      expect(await context.runAccessControl(auth, command)).toBe(false);
    });
  });
});
