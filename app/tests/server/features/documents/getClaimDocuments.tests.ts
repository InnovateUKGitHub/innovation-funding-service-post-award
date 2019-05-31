import { TestContext } from "../../testContextProvider";
import { GetClaimDocumentsQuery } from "@server/features/documents/getClaimDocuments";
import { DocumentDescription } from "@framework/constants";
import { Authorisation, ProjectRole } from "@framework/types";

describe("GetClaimDocumentQuery", () => {
  it("should return all the documents when there is no filter", async () => {
    const context = new TestContext();

    context.testData.createDocument("12345", "cat", "jpg");
    context.testData.createDocument("12345", "cat", "jpg", DocumentDescription.IAR);

    const partner = context.testData.createPartner();
    const project = context.testData.createProject();
    const claim = context.testData.createClaim(partner, 1, (item) => {
      item.Id = "12345";
    });

    const claimKey = {
      projectId: project.Id,
      partnerId: claim.Acc_ProjectParticipant__r.Id,
      periodId: claim.Acc_ProjectPeriodNumber__c
    };

    const query = new GetClaimDocumentsQuery(claimKey);
    const docs = await context.runQuery(query);
    expect(docs).toHaveLength(2);
  });

  it("should return only the relevant documents when there is a filter", async () => {
    const context = new TestContext();

    context.testData.createDocument("12345", "cat1", "jpg");
    context.testData.createDocument("12345", "cat2", "jpg", "hello world", DocumentDescription.IAR);

    const partner = context.testData.createPartner();
    const project = context.testData.createProject();
    const claim = context.testData.createClaim(partner, 1, (item) => {
      item.Id = "12345";
    });

    const claimKey = {
      projectId: project.Id,
      partnerId: claim.Acc_ProjectParticipant__r.Id,
      periodId: claim.Acc_ProjectPeriodNumber__c
    };
    const query = new GetClaimDocumentsQuery(claimKey, { description: DocumentDescription.IAR });
    const docs = await context.runQuery(query);
    expect(docs).toHaveLength(1);
    expect(docs[0].description).toBe(DocumentDescription.IAR);
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
        periodId: 1
      };

      const query = new GetClaimDocumentsQuery(claimKey);

      return { context, query, project, claim };
    };

    test("accessControl - FC can get documents for their claim", async () => {
      const { context, query, project, claim } = setupAccessControlContext();

      const auth = new Authorisation({
        [project.Id]: {
          projectRoles: ProjectRole.FinancialContact,
          partnerRoles: { [claim.Acc_ProjectParticipant__r.Id]: ProjectRole.FinancialContact}
        }
      });

      expect(await context.runAccessControl(auth, query)).toBe(true);
    });

    test("accessControl - MO can get documents for their claim", async () => {
      const { context, query, project, claim } = setupAccessControlContext();

      const auth = new Authorisation({
        [project.Id]: {
          projectRoles: ProjectRole.MonitoringOfficer,
          partnerRoles: { [claim.Acc_ProjectParticipant__r.Id]: ProjectRole.Unknown}
        }
      });

      expect(await context.runAccessControl(auth, query)).toBe(true);
    });

    test("accessControl - no one else can get documents for their claim", async () => {
      const { context, query, project, claim } = setupAccessControlContext();

      const auth = new Authorisation({
        [project.Id]: {
          projectRoles: ProjectRole.ProjectManager | ProjectRole.FinancialContact,
          partnerRoles: { [claim.Acc_ProjectParticipant__r.Id]: ProjectRole.ProjectManager}
        }
      });

      expect(await context.runAccessControl(auth, query)).toBe(false);
    });
  });
});
