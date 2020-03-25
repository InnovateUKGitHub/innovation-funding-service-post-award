import { TestContext } from "../../testContextProvider";
import { DeleteClaimDetailDocumentCommand } from "@server/features/documents/deleteClaimDetailDocument";
import { Authorisation, ProjectRole } from "@framework/types";

describe("DeleteClaimDetailDocumentCommand", () => {
  it("should delete a document", async () => {
    const context = new TestContext();
    const project = context.testData.createProject();
    const partner = context.testData.createPartner(project);
    const claimDetail = context.testData.createClaimDetail(project, undefined, partner);
    const document = context.testData.createDocument(claimDetail.Id, "hello", "txt", "hello");
    expect(context.repositories.documents.Items).toHaveLength(1);

    const claimDetailKey = { projectId: project.Id, partnerId: partner.id, costCategoryId: claimDetail.Acc_CostCategory__c, periodId: claimDetail.Acc_ProjectPeriodNumber__c};
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

      const claimDetailKey = { projectId: project.Id, partnerId: partner.id, costCategoryId: claimDetail.Acc_CostCategory__c, periodId: claimDetail.Acc_ProjectPeriodNumber__c};
      const command = new DeleteClaimDetailDocumentCommand(document.ContentDocumentId, claimDetailKey);

      return {command, project, partner, context};
    };

    test("accessControl - Finance Contact can delete a document", async () => {
      const {command, project, partner, context} = setupAccessControlContext();

      const auth    = new Authorisation({
        [project.Id]: {
          projectRoles: ProjectRole.FinancialContact,
          partnerRoles: { [partner.id]: ProjectRole.FinancialContact }
        }
      });

      expect(await context.runAccessControl(auth, command)).toBe(true);
    });

    test("accessControl - No other role can delete a document", async () => {
      const {command, project, partner, context} = setupAccessControlContext();

      const auth    = new Authorisation({
        [project.Id]: {
          projectRoles: ProjectRole.ProjectManager | ProjectRole.FinancialContact | ProjectRole.MonitoringOfficer,
          partnerRoles: { [partner.id]: ProjectRole.ProjectManager | ProjectRole.MonitoringOfficer }
        }
      });

      expect(await context.runAccessControl(auth, command)).toBe(false);
    });
  });
});
