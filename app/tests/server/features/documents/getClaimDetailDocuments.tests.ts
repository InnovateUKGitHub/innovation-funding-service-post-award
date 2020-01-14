import { TestContext } from "../../testContextProvider";
import { GetClaimDetailDocumentsQuery } from "@server/features/documents/getClaimDetailDocumentsSummary";
import { Authorisation, ProjectRole } from "@framework/types";

describe("GetClaimDetailDocumentsQuery", () => {
  it("returns objects of correct shape", async () => {
    const context = new TestContext();
    const project = context.testData.createProject();
    const partner = context.testData.createPartner(project);
    const claimDetail = context.testData.createClaimDetail(project, undefined, partner);
    const document = context.testData.createDocument(claimDetail.Id, "cat", "jpg", "The Big Show");

    const query = new GetClaimDetailDocumentsQuery(project.Id, claimDetail.Acc_ProjectParticipant__r.Id, claimDetail.Acc_ProjectPeriodNumber__c, claimDetail.Acc_CostCategory__c);
    const result = await context.runQuery(query);
    const item = result[0];

    expect(item.fileName).toBe("cat.jpg");
    expect(item.link).toBe(`/api/documents/claim-details/${project.Id}/${partner.Id}/${claimDetail.Acc_ProjectPeriodNumber__c}/${claimDetail.Acc_CostCategory__c}/${document.Id}/content`);
    expect(item.id).toBe(document.ContentDocumentId);
    expect(item.uploadedBy).toBe("The Big Show");
  });

  it("returns empty array if no claim detail", async () => {
    const context = new TestContext();
    const query = new GetClaimDetailDocumentsQuery("", "", 1, "");
    const result = await context.runQuery(query);

    expect(result).toBeInstanceOf(Array);
    expect(result.length).toBe(0);
  });

  describe("access control", () => {

    const setupAccessControlContext = () => {
      const context = new TestContext();
      const project  = context.testData.createProject();
      const partner  = context.testData.createPartner(project);
      const costCat  = context.testData.createCostCategory();
      const claimDto = context.testData.createClaim(partner);
      const claimDetail = context.testData.createClaimDetail(project, costCat, partner );

      context.testData.createDocument(claimDetail.Id, "cat", "jpg");
      const query = new GetClaimDetailDocumentsQuery(project.Id,  claimDetail.Acc_ProjectParticipant__r.Id, claimDetail.Acc_ProjectPeriodNumber__c, claimDetail.Acc_CostCategory__c);

      return { context, query, project, claimDto };
    };

    test("accessControl - Finance Contect can get documents for their claim", async () => {
      const { context, query, project, claimDto } = setupAccessControlContext();

      const auth = new Authorisation({
        [project.Id]: {
          projectRoles: ProjectRole.FinancialContact,
          partnerRoles: { [claimDto.Acc_ProjectParticipant__r.Id]: ProjectRole.FinancialContact }
        }
      });

      expect(await context.runAccessControl(auth, query)).toBe(true);
    });

    test("accessControl - Finance Contect cannot get documents for other partners claim", async () => {
      const { context, query, project } = setupAccessControlContext();

      const partner2 = context.testData.createPartner(project);

      const auth = new Authorisation({
        [project.Id]: {
          projectRoles: ProjectRole.FinancialContact,
          partnerRoles: { [partner2.Id]: ProjectRole.FinancialContact }
        }
      });

      expect(await context.runAccessControl(auth, query)).toBe(false);
    });

    test("accessControl - Project Manager can get documents for their participant", async () => {

      const { context, query, project, claimDto } = setupAccessControlContext();

      const auth     = new Authorisation({
        [project.Id]: {
          projectRoles: ProjectRole.ProjectManager,
          partnerRoles: { [claimDto.Acc_ProjectParticipant__r.Id]: ProjectRole.ProjectManager }
        }
      });

      expect(await context.runAccessControl(auth, query)).toBe(true);
    });

    test("accessControl - Project Manager can not get documents for other participant", async () => {

      const { context, query, project } = setupAccessControlContext();

      const partner2 = context.testData.createPartner(project);
      const auth     = new Authorisation({
        [project.Id]: {
          projectRoles: ProjectRole.ProjectManager,
          partnerRoles: { [partner2.Id]: ProjectRole.ProjectManager }
        }
      });

      expect(await context.runAccessControl(auth, query)).toBe(false);
    });

    test("accessControl - Monitoring Officer can access documents for their project", async () => {

      const { context, query, project, claimDto } = setupAccessControlContext();

      const auth     = new Authorisation({
        [project.Id]: {
          projectRoles: ProjectRole.MonitoringOfficer,
          partnerRoles: { [claimDto.Acc_ProjectParticipant__r.Id]: ProjectRole.Unknown }
        }
      });

      expect(await context.runAccessControl(auth, query)).toBe(true);
    });
  });
});
