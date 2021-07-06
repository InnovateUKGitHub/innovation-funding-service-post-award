import { PCRItemType, ProjectRole } from "@framework/constants";
import { Authorisation } from "@framework/types";
import { GetAvailableItemTypesQuery } from "@server/features/pcrs/getAvailableItemTypesQuery";
import { pcrRecordTypeMetaValues } from "@server/features/pcrs/getItemTypesQuery";
import { TestContext } from "../../testContextProvider";

describe("GetAvailableItemTypesQuery", () => {
  describe("no current pcr id", () => {
    test("only types from other pcrs should be disabled", async () => {
      // Note: this test is to simulate a user creating a new PCR, i.e. we only need to disable the types of the other open PCRs
      const context = new TestContext();

      const project = context.testData.createProject();
      const pcr = context.testData.createPCR(project);

      const reallocateProjectCostsType = pcrRecordTypeMetaValues.find(
        x => x.type === PCRItemType.MultiplePartnerFinancialVirement,
      )!;

      const pcrRecordTypes = context.testData.createPCRRecordTypes();
      const reallocateSeveralPartnersProjectCost = pcrRecordTypes.find(
        x => x.type === reallocateProjectCostsType.typeName,
      );
      context.testData.createPCRItem(pcr, reallocateSeveralPartnersProjectCost);

      const query = new GetAvailableItemTypesQuery(project.Id);
      const disabledItems = (await context.runQuery(query)).filter(res => res.disabled === true);
      expect(disabledItems).toHaveLength(1);
    });
  });

  describe("current pcr id", () => {
    test("types from other pcrs and current pcr should be disabled", async () => {
      // Note: this is to simulate a user adding a type to an open PCR, i.e. we DO need to disable the current PCR types as well as other open PCR types
      const context = new TestContext();

      const project = context.testData.createProject();
      const pcrRecordTypes = context.testData.createPCRRecordTypes();

      const projectPcr = context.testData.createPCR(project);
      const editingPcr = context.testData.createPCR(project);

      const reallocateProjectCostsType = pcrRecordTypeMetaValues.find(
        x => x.type === PCRItemType.MultiplePartnerFinancialVirement,
      )!;
      const reallocateSeveralPartnersProjectCost = pcrRecordTypes.find(
        x => x.type === reallocateProjectCostsType.typeName,
      );

      const timeExtensionType = pcrRecordTypeMetaValues.find(x => x.type === PCRItemType.TimeExtension)!;
      const changeProjectDuration = pcrRecordTypes.find(x => x.type === timeExtensionType.typeName);

      context.testData.createPCRItem(projectPcr, reallocateSeveralPartnersProjectCost);
      context.testData.createPCRItem(editingPcr, changeProjectDuration);

      const query = new GetAvailableItemTypesQuery(project.Id, editingPcr.id);
      const disabledItems = (await context.runQuery(query)).filter(res => res.disabled === true);
      expect(disabledItems).toHaveLength(2);
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
        projectRoles: ProjectRole.Unknown,
        partnerRoles: {},
      },
    });

    expect(context.runAccessControl(auth, query)).resolves.toBe(false);
  });

  test.each`
    name                       | projectRole
    ${"as financial contact"}  | ${ProjectRole.FinancialContact}
    ${"as monitoring officer"} | ${ProjectRole.MonitoringOfficer}
    ${"as project manager"}    | ${ProjectRole.ProjectManager}
  `("$name", ({ projectRole }) => {
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

    expect(context.runAccessControl(auth, query)).resolves.toBe(true);
  });
});
