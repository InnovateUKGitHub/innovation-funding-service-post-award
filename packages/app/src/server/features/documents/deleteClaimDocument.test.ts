import { ProjectRolePermissionBits } from "@framework/constants/project";
import { Authorisation } from "@framework/types/authorisation";
import { DeleteClaimDocumentCommand } from "@server/features/documents/deleteClaimDocument";

import { TestContext } from "@tests/test-utils/testContextProvider";

describe("DeleteClaimDocumentCommand", () => {
  it("should upload and then delete a document", async () => {
    const context = new TestContext();
    const document = context.testData.createDocument(
      "34",
      "hello",
      "txt",
      "hello",
      undefined,
      undefined,
      x => (x.Acc_UploadedByMe__c = true),
    );
    const project = context.testData.createProject();
    const partner = context.testData.createPartner(project);
    expect(context.repositories.documents.Items).toHaveLength(1);

    const claimKey = {
      projectId: project.Id,
      partnerId: partner.id,
      periodId: 1,
    };

    const deleteCommand = new DeleteClaimDocumentCommand(document.ContentDocumentId, claimKey);
    await context.runCommand(deleteCommand);
    expect(context.repositories.documents.Items).toHaveLength(0);
  });

  describe("access control", () => {
    const setupAccessControlContext = () => {
      const context = new TestContext();
      const project = context.testData.createProject();
      const partner = context.testData.createPartner(project);
      const claim = context.testData.createClaim(partner);
      const document = context.testData.createDocument(claim.Id, "perplexedHippo", "pdf", "it's a hippo", "IAR");
      expect(context.repositories.documents.Items).toHaveLength(1);

      const claimKey = {
        projectId: project.Id,
        partnerId: partner.id,
        periodId: 1,
      };
      const command = new DeleteClaimDocumentCommand(document.ContentDocumentId, claimKey);

      return { command, project, partner, context };
    };

    test("accessControl - Finance Contact can delete an IAR", async () => {
      const { command, project, partner, context } = setupAccessControlContext();

      const auth = new Authorisation({
        [project.Id]: {
          projectRoles: ProjectRolePermissionBits.FinancialContact,
          partnerRoles: { [partner.id]: ProjectRolePermissionBits.FinancialContact },
        },
      });

      expect(await context.runAccessControl(auth, command)).toBe(true);
    });

    test("accessControl - Monitoring officer can delete an IAR", async () => {
      const { command, project, partner, context } = setupAccessControlContext();

      const auth = new Authorisation({
        [project.Id]: {
          projectRoles: ProjectRolePermissionBits.MonitoringOfficer,
          partnerRoles: { [partner.id]: ProjectRolePermissionBits.Unknown },
        },
      });

      expect(await context.runAccessControl(auth, command)).toBe(true);
    });

    test("accessControl - No other role can delete an IAR", async () => {
      const { command, project, partner, context } = setupAccessControlContext();

      const auth = new Authorisation({
        [project.Id]: {
          projectRoles: ProjectRolePermissionBits.ProjectManager | ProjectRolePermissionBits.FinancialContact,
          partnerRoles: { [partner.id]: ProjectRolePermissionBits.ProjectManager | ProjectRolePermissionBits.Unknown },
        },
      });

      expect(await context.runAccessControl(auth, command)).toBe(false);
    });
  });
});
