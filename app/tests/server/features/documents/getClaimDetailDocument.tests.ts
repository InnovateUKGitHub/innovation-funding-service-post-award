import { TestContext } from "../../testContextProvider";
import { Authorisation, ProjectRole } from "@framework/types";
import { GetClaimDetailDocumentQuery } from "@server/features/documents/getClaimDetailDocument";

describe("GetClaimDetailDocumentQuery", () => {
  it("should return result if document exists", async () => {
    const context = new TestContext();
    const project = context.testData.createProject();
    const partner = context.testData.createPartner(project);
    const claimDetail = context.testData.createClaimDetail(project, undefined, partner, 1);

    const document = context.testData.createDocument(claimDetail.Id, "cat", "jpg", "","file content");

    const query = new GetClaimDetailDocumentQuery({ projectId: project.Id, partnerId: partner.Id, periodId: claimDetail.Acc_ProjectPeriodNumber__c, costCategoryId: claimDetail.Acc_CostCategory__c }, document.Id);
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
    const claimDetail = context.testData.createClaimDetail(project, undefined, partner, 1);

    const query = new GetClaimDetailDocumentQuery({ projectId: project.Id, partnerId: partner.Id, periodId: claimDetail.Acc_ProjectPeriodNumber__c, costCategoryId: claimDetail.Acc_CostCategory__c }, "FAKE ID");
    const result = await context.runQuery(query);

    expect(result).toBe(null);
  });

  it("should return null if document belongs to another project", async () => {
    const context = new TestContext();
    const project1 = context.testData.createProject();
    const partner1 = context.testData.createPartner(project1);
    const claimDetail1 = context.testData.createClaimDetail(project1, undefined, partner1, 1);

    const project2 = context.testData.createProject();
    const partner2 = context.testData.createPartner(project2);
    const claimDetail2 = context.testData.createClaimDetail(project2, undefined, partner2, 1);

    const document = context.testData.createDocument(claimDetail1.Id);

    const query = new GetClaimDetailDocumentQuery({ projectId: project2.Id, partnerId: partner2.Id, periodId: claimDetail2.Acc_ProjectPeriodNumber__c, costCategoryId: claimDetail2.Acc_CostCategory__c }, document.Id);
    const result = await context.runQuery(query);

    expect(result).toBe(null);
  });

  it("should return null if document belongs to another partner", async () => {
    const context = new TestContext();
    const project = context.testData.createProject();
    const partner1 = context.testData.createPartner(project);
    const claimDetail1 = context.testData.createClaimDetail(project, undefined, partner1, 1);

    const partner2 = context.testData.createPartner(project);
    const claimDetail2 = context.testData.createClaimDetail(project, undefined, partner2, 1);

    const document = context.testData.createDocument(claimDetail1.Id);

    const query = new GetClaimDetailDocumentQuery({ projectId: project.Id, partnerId: partner2.Id, periodId: claimDetail2.Acc_ProjectPeriodNumber__c, costCategoryId: claimDetail2.Acc_CostCategory__c }, document.Id);
    const result = await context.runQuery(query);

    expect(result).toBe(null);
  });

  it("should return null if document belongs to another claim detail", async () => {
    const context = new TestContext();
    const project = context.testData.createProject();
    const partner = context.testData.createPartner(project);
    const claimDetail1 = context.testData.createClaimDetail(project, undefined, partner, 1);
    const claimDetail2 = context.testData.createClaimDetail(project, undefined, partner, 1);

    const document = context.testData.createDocument(claimDetail1.Id);

    const query = new GetClaimDetailDocumentQuery({ projectId: project.Id, partnerId: partner.Id, periodId: claimDetail2.Acc_ProjectPeriodNumber__c, costCategoryId: claimDetail2.Acc_CostCategory__c }, document.Id);
    const result = await context.runQuery(query);

    expect(result).toBe(null);
  });

  describe("authorisation", () => {
    it("should allow MO of project to run", async () => {
      const context = new TestContext();

      const project = context.testData.createProject();
      const partner = context.testData.createPartner(project);
      const claimDetail = context.testData.createClaimDetail(project, undefined, partner, 1);

      const document = context.testData.createDocument(claimDetail.Id);

      const query = new GetClaimDetailDocumentQuery({ projectId: project.Id, partnerId: partner.Id, periodId: claimDetail.Acc_ProjectPeriodNumber__c, costCategoryId: claimDetail.Acc_CostCategory__c }, document.Id);

      const auth = new Authorisation({ [project.Id]: { projectRoles: ProjectRole.MonitoringOfficer, partnerRoles: {} } });
      expect(await context.runAccessControl(auth, query)).toBe(true);
    });

    it("should allow PM of partner to run", async () => {
      const context = new TestContext();

      const project = context.testData.createProject();
      const partner = context.testData.createPartner(project);
      const claimDetail = context.testData.createClaimDetail(project, undefined, partner, 1);
      const document = context.testData.createDocument(claimDetail.Id);

      const query = new GetClaimDetailDocumentQuery({ projectId: project.Id, partnerId: partner.Id, periodId: claimDetail.Acc_ProjectPeriodNumber__c, costCategoryId: claimDetail.Acc_CostCategory__c }, document.Id);

      const auth = new Authorisation({ [project.Id]: { projectRoles: ProjectRole.ProjectManager, partnerRoles: { [partner.Id]: ProjectRole.ProjectManager } } });
      expect(await context.runAccessControl(auth, query)).toBe(true);
    });

    it("should not allow PM of other partner to run", async () => {
      const context = new TestContext();

      const project = context.testData.createProject();
      const partner1 = context.testData.createPartner(project);
      const partner2 = context.testData.createPartner(project);
      const claimDetail = context.testData.createClaimDetail(project, undefined, partner1, 1);
      const document = context.testData.createDocument(claimDetail.Id);

      const query = new GetClaimDetailDocumentQuery({ projectId: project.Id, partnerId: partner1.Id, periodId: claimDetail.Acc_ProjectPeriodNumber__c, costCategoryId: claimDetail.Acc_CostCategory__c }, document.Id);

      const auth = new Authorisation({ [project.Id]: { projectRoles: ProjectRole.ProjectManager, partnerRoles: { [partner2.Id] : ProjectRole.ProjectManager } } });
      expect(await context.runAccessControl(auth, query)).toBe(false);
    });

    it("should allow FC of partner to run", async () => {
      const context = new TestContext();

      const project = context.testData.createProject();
      const partner = context.testData.createPartner(project);
      const claimDetail = context.testData.createClaimDetail(project, undefined, partner, 1);
      const document = context.testData.createDocument(claimDetail.Id);

      const query = new GetClaimDetailDocumentQuery({ projectId: project.Id, partnerId: partner.Id, periodId: claimDetail.Acc_ProjectPeriodNumber__c, costCategoryId: claimDetail.Acc_CostCategory__c }, document.Id);

      const auth = new Authorisation({ [project.Id]: { projectRoles: ProjectRole.FinancialContact, partnerRoles: { [partner.Id]: ProjectRole.FinancialContact } } });
      expect(await context.runAccessControl(auth, query)).toBe(true);
    });

    it("should not allow FC of other partner to run", async () => {
      const context = new TestContext();

      const project = context.testData.createProject();
      const partner = context.testData.createPartner(project);
      const partner2 = context.testData.createPartner(project);
      const claimDetail = context.testData.createClaimDetail(project, undefined, partner, 1);
      const document = context.testData.createDocument(claimDetail.Id);

      const query = new GetClaimDetailDocumentQuery({ projectId: project.Id, partnerId: partner.Id, periodId: claimDetail.Acc_ProjectPeriodNumber__c, costCategoryId: claimDetail.Acc_CostCategory__c }, document.Id);

      const auth = new Authorisation({ [project.Id]: { projectRoles: ProjectRole.FinancialContact, partnerRoles: { [partner2.Id]: ProjectRole.FinancialContact } } });
      expect(await context.runAccessControl(auth, query)).toBe(false);
    });

  });
});
