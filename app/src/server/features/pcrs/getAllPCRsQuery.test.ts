import { PCRStatus, PCRItemType } from "@framework/constants/pcrConstants";
import { GetAllPCRsQuery } from "@server/features/pcrs/getAllPCRsQuery";
import { GetPCRItemTypesQuery } from "@server/features/pcrs/getItemTypesQuery";
import { TestContext } from "@tests/test-utils/testContextProvider";
import { DateTime } from "luxon";

describe("GetAllPCRsQuery", () => {
  test("when project has no pcrs then empty list returned", async () => {
    const context = new TestContext();
    const project = context.testData.createProject();

    const query = new GetAllPCRsQuery(project.Id);

    const result = await context.runQuery(query);

    expect(result).toEqual([]);
  });

  test("only pcrs returned for specified project", async () => {
    const context = new TestContext();
    const project1 = context.testData.createProject();
    const project2 = context.testData.createProject();

    const expected = context.testData.createPCR(project1);
    context.testData.createPCR(project2);

    const query = new GetAllPCRsQuery(project1.Id);

    const result = await context.runQuery(query);

    expect(result.map(x => x.id)).toEqual([expected.id]);
  });

  test("all pcrs are retuned sorted by number descending", async () => {
    const context = new TestContext();
    const project = context.testData.createProject();

    const expected = context.testData.range(5, x => context.testData.createPCR(project, { number: x }));

    const query = new GetAllPCRsQuery(project.Id);

    const result = await context.runQuery(query);

    expect(result.map(x => x.id)).toEqual(expected.map(x => x.id).reverse());
  });

  test("pcrs fields are returned as expected", async () => {
    const context = new TestContext();

    const expected = context.testData.createPCR(undefined, {
      id: "Expected Id" as PcrId,
      started: DateTime.fromFormat("1 april 2013", "d MMM yyyy").toJSDate(),
      updated: DateTime.fromFormat("1 october 2013", "d MMM yyyy").toJSDate(),
      number: 531,
      status: 55 as PCRStatus,
      statusName: "Expected Status",
    });

    const query = new GetAllPCRsQuery(expected.projectId);

    const result = await context.runQuery(query).then(x => x[0]);

    expect(result.id).toEqual(expected.id);
    expect(result.started).toEqual(expected.started);
    expect(result.lastUpdated).toEqual(expected.updated);
    expect(result.requestNumber).toEqual(expected.number);
    expect(result.status).toEqual(expected.status);
    expect(result.statusName).toEqual(expected.statusName);
    expect(result.items).toEqual([]);
  });

  test.each`
    role    | numberOfProjects
    ${"mo"} | ${2}
    ${"fc"} | ${3}
    ${"pm"} | ${3}
  `(
    "draft PCRs are not hidden for role $role",
    async ({ role, numberOfProjects }: { role: "fc" | "mo" | "pm"; numberOfProjects: number }) => {
      const context = new TestContext();
      const project = context.testData.createProject();

      if (role === "mo") context.testData.createCurrentUserAsMonitoringOfficer(project);
      if (role === "fc") context.testData.createCurrentUserAsFinanceContact(project);
      if (role === "pm") context.testData.createCurrentUserAsProjectManager(project);

      // Create 2 PCRs that should be retuned
      context.testData.createPCR(project, {
        status: PCRStatus.SubmittedToMonitoringOfficer,
      });
      context.testData.createPCR(project, {
        status: PCRStatus.Approved,
      });

      // Create a PCR that should NOT be returned, if we're an MO.
      context.testData.createPCR(project, {
        status: PCRStatus.Draft,
      });

      const query = new GetAllPCRsQuery(project.Id);
      const results = await context.runQuery(query);

      expect(results).toHaveLength(numberOfProjects);
    },
  );

  test("draft PCRs are hidden for MOs", async () => {
    const context = new TestContext();
    const project = context.testData.createProject();
    context.testData.createCurrentUserAsMonitoringOfficer(project);

    // Create a PCR that should be returned
    const expected = context.testData.createPCR(project, {
      status: PCRStatus.SubmittedToMonitoringOfficer,
    });

    // Create a PCR that should NOT be returned.
    context.testData.createPCR(project, {
      status: PCRStatus.Draft,
    });

    const query = new GetAllPCRsQuery(expected.projectId);

    const results = await context.runQuery(query);

    // Expect only one PCR to be retrieved.
    expect(results).toHaveLength(1);
  });

  test("pcrs items are returned as expected", async () => {
    const context = new TestContext();

    const recordTypes = context.testData.createPCRRecordTypes();

    const pcr = context.testData.createPCR();
    context.testData.range(recordTypes.length, (x, i) => context.testData.createPCRItem(pcr, recordTypes[i]));

    const query = new GetAllPCRsQuery(pcr.projectId);

    const result = await context.runQuery(query).then(x => x[0]);

    const expectedTypes = [
      PCRItemType.MultiplePartnerFinancialVirement,
      PCRItemType.PartnerWithdrawal,
      PCRItemType.PartnerAddition,
      PCRItemType.ScopeChange,
      PCRItemType.TimeExtension,
      PCRItemType.AccountNameChange,
      PCRItemType.ProjectSuspension,
      PCRItemType.ProjectTermination,
    ];

    const expectedNames = [
      "Reallocate project costs",
      "Remove a partner",
      "Add a partner",
      "Change project scope",
      "Change project duration",
      "Change a partner's name",
      "Put project on hold",
      "End the project early",
    ];

    expect(result.items.map(x => x.type)).toEqual(expectedTypes);
    expect(result.items.map(x => x.typeName)).toEqual(expectedNames);
  });

  it("returns the item short name if available", async () => {
    const context = new TestContext();
    const pcrItemType = GetPCRItemTypesQuery.recordTypeMetaValues.find(x => x.type === PCRItemType.PartnerWithdrawal);
    const recordType = context.testData.createRecordType({
      type: pcrItemType?.typeName,
      parent: "Acc_ProjectChangeRequest__c",
    });
    const pcr = context.testData.createPCR();
    context.testData.createPCRItem(pcr, recordType, { shortName: "Get rid" });
    const query = new GetAllPCRsQuery(pcr.projectId);
    const result = await context.runQuery(query).then(x => x[0]);
    expect(result.items[0].shortName).toEqual("Get rid");
  });

  it("returns the item type name if short name is not available", async () => {
    const context = new TestContext();
    const pcrItemType = GetPCRItemTypesQuery.recordTypeMetaValues.find(x => x.type === PCRItemType.PartnerWithdrawal);
    const recordType = context.testData.createRecordType({
      type: pcrItemType?.typeName,
      parent: "Acc_ProjectChangeRequest__c",
    });
    const pcr = context.testData.createPCR();
    context.testData.createPCRItem(pcr, recordType, { shortName: undefined });
    const query = new GetAllPCRsQuery(pcr.projectId);
    const result = await context.runQuery(query).then(x => x[0]);
    expect(result.items[0].shortName).toEqual(recordType.type);
  });
});
