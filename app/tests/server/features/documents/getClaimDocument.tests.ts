import { TestContext } from "../../testContextProvider";
import { Authorisation, ProjectRole } from "@framework/types";
import { GetClaimDocumentQuery } from "@server/features/documents/getClaimDocument";

describe("GetClaimDocumentQuery", () => {
  it("should return result if document exists", async () => {
    const context = new TestContext();
    const project = context.testData.createProject();
    const partner = context.testData.createPartner(project);
    const claim = context.testData.createClaim(partner, 1);

    const document = context.testData.createDocument(claim.Id, "cat", "jpg", "file content");

    const query = new GetClaimDocumentQuery({projectId: project.Id, partnerId: partner.Id, periodId: claim.Acc_ProjectPeriodNumber__c}, document.Id);
    const result = await context.runQuery(query).then(x => x!);

    expect(result).not.toBeNull();
    expect(result.fileName).toBe("cat.jpg");
    expect(result.fileType).toBe("jpg");
    expect(result.contentLength).toBe("file content".length);
    expect(result.stream).not.toBeNull();
  });

  it("should return null if document dosnt exist", async () => {
    const context = new TestContext();
    const project = context.testData.createProject();
    const partner = context.testData.createPartner(project);
    const claim = context.testData.createClaim(partner, 1);

    const query = new GetClaimDocumentQuery({projectId: project.Id, partnerId: partner.Id, periodId: claim.Acc_ProjectPeriodNumber__c}, "FAKE ID");
    const result = await context.runQuery(query);

    expect(result).toBe(null);
  });

  it("should return null if document belongs to another project", async () => {
    const context = new TestContext();
    const project1 = context.testData.createProject();
    const partner1 = context.testData.createPartner(project1);
    const claim1 = context.testData.createClaim(partner1, 1);

    const project2 = context.testData.createProject();
    const partner2 = context.testData.createPartner(project2);
    const claim2 = context.testData.createClaim(partner2, 1);

    const document = context.testData.createDocument(claim1.Id);

    const query = new GetClaimDocumentQuery({projectId: project2.Id, partnerId: partner2.Id, periodId: claim2.Acc_ProjectPeriodNumber__c}, document.Id);
    const result = await context.runQuery(query);

    expect(result).toBe(null);
  });

  it("should return null if document belongs to another partner", async () => {
    const context = new TestContext();
    const project = context.testData.createProject();
    const partner1 = context.testData.createPartner(project);
    const claim1 = context.testData.createClaim(partner1, 1);

    const partner2 = context.testData.createPartner(project);
    const claim2 = context.testData.createClaim(partner2, 1);

    const document = context.testData.createDocument(claim1.Id);

    const query = new GetClaimDocumentQuery({projectId: project.Id, partnerId: partner2.Id, periodId: claim2.Acc_ProjectPeriodNumber__c}, document.Id);
    const result = await context.runQuery(query);

    expect(result).toBe(null);
  });

  it("should return null if document belongs to another claim", async () => {
    const context = new TestContext();
    const project = context.testData.createProject();
    const partner = context.testData.createPartner(project);
    const claim1 = context.testData.createClaim(partner, 1);
    const claim2 = context.testData.createClaim(partner, 2);

    const document = context.testData.createDocument(claim1.Id);

    const query = new GetClaimDocumentQuery({projectId: project.Id, partnerId: partner.Id, periodId: claim2.Acc_ProjectPeriodNumber__c}, document.Id);
    const result = await context.runQuery(query);

    expect(result).toBe(null);
  });

  describe("authorisation", () => {
    it("should allow MO of project to run", async () => {
      const context = new TestContext();

      const project = context.testData.createProject();
      const partner = context.testData.createPartner(project);
      const claim = context.testData.createClaim(partner, 1);
      const document = context.testData.createDocument(claim.Id);

      const query = new GetClaimDocumentQuery({projectId: project.Id, partnerId: partner.Id, periodId: claim.Acc_ProjectPeriodNumber__c}, document.Id);

      const auth = new Authorisation({ [project.Id]: { projectRoles: ProjectRole.MonitoringOfficer, partnerRoles: {} } });
      expect(await context.runAccessControl(auth, query)).toBe(true);
    });

    it("should not allow PM of other partner to run", async () => {
      const context = new TestContext();

      const project = context.testData.createProject();
      const partner = context.testData.createPartner(project);
      const claim = context.testData.createClaim(partner, 1);
      const document = context.testData.createDocument(claim.Id);

      const query = new GetClaimDocumentQuery({projectId: project.Id, partnerId: partner.Id, periodId: claim.Acc_ProjectPeriodNumber__c}, document.Id);

      const auth = new Authorisation({ [project.Id]: { projectRoles: ProjectRole.ProjectManager, partnerRoles: {} } });
      expect(await context.runAccessControl(auth, query)).toBe(false);
    });

    it("should not allow PM of partner to run", async () => {
      const context = new TestContext();

      const project = context.testData.createProject();
      const partner = context.testData.createPartner(project);
      const claim = context.testData.createClaim(partner, 1);
      const document = context.testData.createDocument(claim.Id);

      const query = new GetClaimDocumentQuery({projectId: project.Id, partnerId: partner.Id, periodId: claim.Acc_ProjectPeriodNumber__c}, document.Id);

      const auth = new Authorisation({ [project.Id]: { projectRoles: ProjectRole.ProjectManager, partnerRoles: { [partner.Id] : ProjectRole.ProjectManager } } });
      expect(await context.runAccessControl(auth, query)).toBe(true);
    });

    it("should allow FC of partner to run", async () => {
      const context = new TestContext();

      const project = context.testData.createProject();
      const partner = context.testData.createPartner(project);
      const claim = context.testData.createClaim(partner, 1);
      const document = context.testData.createDocument(claim.Id);

      const query = new GetClaimDocumentQuery({projectId: project.Id, partnerId: partner.Id, periodId: claim.Acc_ProjectPeriodNumber__c}, document.Id);

      const auth = new Authorisation({ [project.Id]: { projectRoles: ProjectRole.FinancialContact, partnerRoles: { [partner.Id] : ProjectRole.FinancialContact} } });
      expect(await context.runAccessControl(auth, query)).toBe(true);
    });

    it("should not allow FC of other partner to run", async () => {
      const context = new TestContext();

      const project = context.testData.createProject();
      const partner = context.testData.createPartner(project);
      const partner2 = context.testData.createPartner(project);
      const claim = context.testData.createClaim(partner, 1);
      const document = context.testData.createDocument(claim.Id);

      const query = new GetClaimDocumentQuery({projectId: project.Id, partnerId: partner.Id, periodId: claim.Acc_ProjectPeriodNumber__c}, document.Id);

      const auth = new Authorisation({ [project.Id]: { projectRoles: ProjectRole.FinancialContact, partnerRoles: { [partner2.Id] : ProjectRole.FinancialContact} } });
      expect(await context.runAccessControl(auth, query)).toBe(false);
    });

  });
});
