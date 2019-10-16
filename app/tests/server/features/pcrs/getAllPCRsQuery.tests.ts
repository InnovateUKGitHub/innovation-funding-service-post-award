// tslint:disable:no-identical-functions no-duplicate-string
import { TestContext } from "../../testContextProvider";
import { GetAllPCRsQuery } from "@server/features/pcrs/getAllPCRsQuery";
import { DateTime } from "luxon";
import { PCRItemType, PCRStatus } from "@framework/constants";

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

    const expected = context.testData.range(5, (x) => context.testData.createPCR(project, { number: x }));

    const query = new GetAllPCRsQuery(project.Id);

    const result = await context.runQuery(query);

    expect(result.map(x => x.id)).toEqual(expected.map(x => x.id).reverse());
  });

  test("pcrs files are returned as expected", async () => {
    const context = new TestContext();

    const expected = context.testData.createPCR(undefined, {
      id: "Expected Id",
      started: DateTime.fromFormat("1 april 2013", "d MMM yyyy").toJSDate(),
      updated: DateTime.fromFormat("1 october 2013", "d MMM yyyy").toJSDate(),
      number: 531,
      status: 55 as PCRStatus,
      statusName: "Expected Status"
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

  test("pcrs fields are returned as expected", async () => {
    const context = new TestContext();

    const expected = context.testData.createPCR(undefined, {
      id: "Expected Id",
      started: DateTime.fromFormat("1 april 2013", "d MMM yyyy").toJSDate(),
      updated: DateTime.fromFormat("1 october 2013", "d MMM yyyy").toJSDate(),
      number: 531,
      status: 55 as PCRStatus,
      statusName: "Expected Status"
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

  test("pcrs items are returned as expected", async () => {
    const context = new TestContext();

    const recordTypes = context.testData.createPCRRecordTypes();

    const pcr = context.testData.createPCR();
    context.testData.range(recordTypes.length, (x,i) => context.testData.createPCRItem(pcr, recordTypes[i]));

    const query = new GetAllPCRsQuery(pcr.projectId);

    const result = await context.runQuery(query).then(x => x[0]);

    const expectedTypes = [
      PCRItemType.SinglePartnerFinancialVirement,
      PCRItemType.MultiplePartnerFinancialVirement,
      PCRItemType.PartnerWithdrawal,
      PCRItemType.PartnerAddition,
      PCRItemType.ScopeChange,
      PCRItemType.TimeExtension,
      PCRItemType.AccountNameChange,
      PCRItemType.ProjectSuspension,
      PCRItemType.ProjectTermination,
    ];

    expect(result.items.map(x => x.type)).toEqual(expectedTypes);
    expect(result.items.map(x => x.typeName)).toEqual(recordTypes.map(x => x.type));
  });
});
