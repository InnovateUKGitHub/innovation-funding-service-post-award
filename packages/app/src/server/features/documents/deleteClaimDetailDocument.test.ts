import { ProjectRolePermissionBits } from "@framework/constants/project";
import { Authorisation } from "@framework/types/authorisation";
import { DeleteClaimDetailDocumentCommand } from "@server/features/documents/deleteClaimDetailDocument";

import { TestContext } from "@tests/test-utils/testContextProvider";

describe("DeleteClaimDetailDocumentCommand", () => {
  it("should delete a document", async () => {
    const context = new TestContext();
    const project = context.testData.createProject();
    const partner = context.testData.createPartner(project);
    const claimDetail = context.testData.createClaimDetail(project, undefined, partner);
    const document = context.testData.createDocument(
      claimDetail.Id,
      "hello",
      "txt",
      "hello",
      undefined,
      undefined,
      x => (x.Acc_UploadedByMe__c = true),
    );
    expect(context.repositories.documents.Items).toHaveLength(1);

    const claimDetailKey = {
      projectId: project.Id,
      partnerId: partner.id,
      costCategoryId: claimDetail.Acc_CostCategory__c as CostCategoryId,
      periodId: claimDetail.Acc_ProjectPeriodNumber__c as PeriodId,
    };
    const deleteCommand = new DeleteClaimDetailDocumentCommand(document.ContentDocumentId, claimDetailKey);
    await context.runCommand(deleteCommand);
    expect(context.repositories.documents.Items).toHaveLength(0);
  });

  describe("access control", () => {
    const setupAccessControlContext = () => {
      const context = new TestContext();
      const project = context.testData.createProject();
      const partner = context.testData.createPartner(project);
      const claimDetail = context.testData.createClaimDetail(project, undefined, partner);
      const document = context.testData.createDocument(claimDetail.Id, "hello", "txt", "hello");
      expect(context.repositories.documents.Items).toHaveLength(1);

      const claimDetailKey = {
        projectId: project.Id,
        partnerId: partner.id,
        costCategoryId: claimDetail.Acc_CostCategory__c as CostCategoryId,
        periodId: claimDetail.Acc_ProjectPeriodNumber__c as PeriodId,
      };
      const command = new DeleteClaimDetailDocumentCommand(document.ContentDocumentId, claimDetailKey);

      return { command, project, partner, context };
    };

    test("accessControl - Finance Contact can delete a document", async () => {
      const { command, project, partner, context } = setupAccessControlContext();

      const auth = new Authorisation({
        [project.Id]: {
          projectRoles: ProjectRolePermissionBits.FinancialContact,
          partnerRoles: { [partner.id]: ProjectRolePermissionBits.FinancialContact },
        },
      });

      expect(await context.runAccessControl(auth, command)).toBe(true);
    });

    test("accessControl - No other role can delete a document", async () => {
      const { command, project, partner, context } = setupAccessControlContext();

      const auth = new Authorisation({
        [project.Id]: {
          projectRoles:
            ProjectRolePermissionBits.ProjectManager |
            ProjectRolePermissionBits.FinancialContact |
            ProjectRolePermissionBits.MonitoringOfficer,
          partnerRoles: {
            [partner.id]: ProjectRolePermissionBits.ProjectManager | ProjectRolePermissionBits.MonitoringOfficer,
          },
        },
      });

      expect(await context.runAccessControl(auth, command)).toBe(false);
    });
  });
});
