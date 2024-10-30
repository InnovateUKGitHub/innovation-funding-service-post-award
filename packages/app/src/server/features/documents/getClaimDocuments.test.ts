import { DocumentDescription } from "@framework/constants/documentDescription";
import { ProjectRolePermissionBits } from "@framework/constants/project";
import { Authorisation } from "@framework/types/authorisation";
import { GetClaimDocumentsQuery } from "@server/features/documents/getClaimDocumentsSummary";

import { TestContext } from "@tests/test-utils/testContextProvider";

describe("GetClaimDocumentQuery", () => {
  it("should return all the documents when there is no filter", async () => {
    const context = new TestContext();

    context.testData.createDocument("12345", "cat", "jpg");
    context.testData.createDocument("12345", "cat", "jpg", "IAR");

    const partner = context.testData.createPartner();
    const project = context.testData.createProject();
    const claim = context.testData.createClaim(partner, 1, item => {
      item.Id = "12345";
    });

    const claimKey = {
      projectId: project.Id,
      partnerId: claim.Acc_ProjectParticipant__r.Id,
      periodId: claim.Acc_ProjectPeriodNumber__c,
    };

    const query = new GetClaimDocumentsQuery(claimKey);
    const docs = await context.runQuery(query);
    expect(docs).toHaveLength(2);
  });

  it("should return only the relevant documents when there is a filter", async () => {
    const context = new TestContext();

    context.testData.createDocument("12345", "cat1", "jpg");
    context.testData.createDocument("12345", "cat2", "jpg", "Tim Berners-Lee", "hello world", "IAR");

    const partner = context.testData.createPartner();
    const project = context.testData.createProject();
    const claim = context.testData.createClaim(partner, 1, item => {
      item.Id = "12345";
    });

    const claimKey = {
      projectId: project.Id,
      partnerId: claim.Acc_ProjectParticipant__r.Id,
      periodId: claim.Acc_ProjectPeriodNumber__c,
    };
    const query = new GetClaimDocumentsQuery(claimKey, { description: DocumentDescription.IAR });
    const docs = await context.runQuery(query);
    expect(docs).toHaveLength(1);
    expect(docs[0].description).toBe(DocumentDescription.IAR);
  });

  it("should return the document url", async () => {
    const context = new TestContext();

    const project = context.testData.createProject();
    const partner = context.testData.createPartner(project);
    const claim = context.testData.createClaim(partner);

    const document = context.testData.createDocument(claim.Id);

    const query = new GetClaimDocumentsQuery({
      projectId: project.Id,
      partnerId: partner.id,
      periodId: claim.Acc_ProjectPeriodNumber__c,
    });
    const result = await context.runQuery(query).then(x => x[0]);

    expect(result.id).toBe(document.Id);
    expect(result.link).toBe(
      `/api/documents/claims/${project.Id}/${partner.id}/${claim.Acc_ProjectPeriodNumber__c}/${document.Id}/content`,
    );
  });

  describe("access control", () => {
    const setupAccessControlContext = () => {
      const context = new TestContext();
      const project = context.testData.createProject();
      const partner = context.testData.createPartner(project);
      const claim = context.testData.createClaim(partner);

      const claimKey = {
        projectId: project.Id,
        partnerId: partner.id,
        periodId: 1,
      };

      const query = new GetClaimDocumentsQuery(claimKey);

      return { context, query, project, claim };
    };

    test("accessControl - FC can not get documents for other partner claim", async () => {
      const { context, query, project } = setupAccessControlContext();

      const partner2 = context.testData.createPartner(project);

      const auth = new Authorisation({
        [project.Id]: {
          projectRoles: ProjectRolePermissionBits.FinancialContact,
          partnerRoles: { [partner2.id]: ProjectRolePermissionBits.FinancialContact },
        },
      });

      expect(await context.runAccessControl(auth, query)).toBe(false);
    });

    test("accessControl - FC can get documents for their claim", async () => {
      const { context, query, project, claim } = setupAccessControlContext();

      const auth = new Authorisation({
        [project.Id]: {
          projectRoles: ProjectRolePermissionBits.FinancialContact,
          partnerRoles: { [claim.Acc_ProjectParticipant__r.Id]: ProjectRolePermissionBits.FinancialContact },
        },
      });

      expect(await context.runAccessControl(auth, query)).toBe(true);
    });

    test("accessControl - MO can get documents for their claim", async () => {
      const { context, query, project, claim } = setupAccessControlContext();

      const auth = new Authorisation({
        [project.Id]: {
          projectRoles: ProjectRolePermissionBits.MonitoringOfficer,
          partnerRoles: { [claim.Acc_ProjectParticipant__r.Id]: ProjectRolePermissionBits.Unknown },
        },
      });

      expect(await context.runAccessControl(auth, query)).toBe(true);
    });

    test("accessControl - PM can get documents for their claim", async () => {
      const { context, query, project, claim } = setupAccessControlContext();

      const auth = new Authorisation({
        [project.Id]: {
          projectRoles: ProjectRolePermissionBits.ProjectManager,
          partnerRoles: { [claim.Acc_ProjectParticipant__r.Id]: ProjectRolePermissionBits.ProjectManager },
        },
      });

      expect(await context.runAccessControl(auth, query)).toBe(true);
    });

    test("accessControl - PM can get documents for other partners claim", async () => {
      const { context, query, project } = setupAccessControlContext();

      const partner2 = context.testData.createPartner(project);

      const auth = new Authorisation({
        [project.Id]: {
          projectRoles: ProjectRolePermissionBits.ProjectManager,
          partnerRoles: { [partner2.id]: ProjectRolePermissionBits.ProjectManager },
        },
      });

      expect(await context.runAccessControl(auth, query)).toBe(true);
    });
  });
});
