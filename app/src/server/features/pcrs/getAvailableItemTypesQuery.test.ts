import { PCRItemType, pcrItemTypes } from "@framework/constants/pcrConstants";
import { ProjectRolePermissionBits } from "@framework/constants/project";
import { Authorisation } from "@framework/types/authorisation";
import { GetAvailableItemTypesQuery } from "@server/features/pcrs/getAvailableItemTypesQuery";
import { TestContext } from "@tests/test-utils/testContextProvider";

describe("GetAvailableItemTypesQuery", () => {
  describe("no current pcr id", () => {
    test("only types from other pcrs should be disabled", async () => {
      // Note: this test is to simulate a user creating a new PCR, i.e. we only need to disable the types of the other open PCRs
      const context = new TestContext();

      const project = context.testData.createProject();
      const pcr = context.testData.createPCR(project);

      const reallocateProjectCostsType = pcrItemTypes.find(
        x => x.type === PCRItemType.MultiplePartnerFinancialVirement,
      );

      const pcrRecordTypes = context.testData.createPCRRecordTypes();
      const reallocateSeveralPartnersProjectCost = pcrRecordTypes.find(
        x => x.type === reallocateProjectCostsType?.typeName,
      );
      context.testData.createPCRItem(pcr, reallocateSeveralPartnersProjectCost);

      const query = new GetAvailableItemTypesQuery(project.Id);
      const disabledItems = (await context.runQuery(query)).filter(res => res.hidden === true);
      expect(disabledItems).toHaveLength(1);
    });
  });

  describe("current pcr id", () => {
    test("types from other pcrs and current pcr should be hidden", async () => {
      // Note: this is to simulate a user adding a type to an open PCR, i.e. we DO need to disable the current PCR types as well as other open PCR types
      const context = new TestContext();

      const project = context.testData.createProject();
      const pcrRecordTypes = context.testData.createPCRRecordTypes();

      const projectPcr = context.testData.createPCR(project);
      const editingPcr = context.testData.createPCR(project);

      const reallocateProjectCostsType = pcrItemTypes.find(
        x => x.type === PCRItemType.MultiplePartnerFinancialVirement,
      );
      const reallocateSeveralPartnersProjectCost = pcrRecordTypes.find(
        x => x.type === reallocateProjectCostsType?.typeName,
      );

      const timeExtensionType = pcrItemTypes.find(x => x.type === PCRItemType.TimeExtension);
      const changeProjectDuration = pcrRecordTypes.find(x => x.type === timeExtensionType?.typeName);

      context.testData.createPCRItem(projectPcr, reallocateSeveralPartnersProjectCost);
      context.testData.createPCRItem(editingPcr, changeProjectDuration);

      const query = new GetAvailableItemTypesQuery(project.Id, editingPcr.id);
      const hiddenItems = (await context.runQuery(query)).filter(res => res.hidden === true);

      // MultiplePartnerFinancialVirement, TimeExtension, Remove Partner and Rename Partner should be disabled.
      // Remove Partner is disabled because there are no partners in this project to remove.
      expect(hiddenItems).toHaveLength(5);
    });
  });
});

describe("authorisation", () => {
  test("with unknown role", async () => {
    const context = new TestContext();
    const project = context.testData.createProject();
    context.testData.createPartner(project);

    const query = new GetAvailableItemTypesQuery(project.Id);
    const auth = new Authorisation({
      [project.Id]: {
        projectRoles: ProjectRolePermissionBits.Unknown,
        partnerRoles: {},
      },
    });

    await expect(context.runAccessControl(auth, query)).resolves.toBe(false);
  });

  test.each`
    name                       | projectRole
    ${"as financial contact"}  | ${ProjectRolePermissionBits.FinancialContact}
    ${"as monitoring officer"} | ${ProjectRolePermissionBits.MonitoringOfficer}
    ${"as project manager"}    | ${ProjectRolePermissionBits.ProjectManager}
  `("$name", async ({ projectRole }) => {
    const context = new TestContext();
    const project = context.testData.createProject();
    context.testData.createPartner(project);

    const query = new GetAvailableItemTypesQuery(project.Id);
    const auth = new Authorisation({
      [project.Id]: {
        projectRoles: projectRole,
        partnerRoles: {},
      },
    });

    await expect(context.runAccessControl(auth, query)).resolves.toBe(true);
  });
});
