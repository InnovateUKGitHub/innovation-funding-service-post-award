// tslint:disable:no-identical-functions no-duplicate-string
import { TestContext } from "../../testContextProvider";
import { GetPCRByIdQuery } from "@server/features/pcrs/getPCRByIdQuery";
import { DateTime } from "luxon";
import { ProjectChangeRequestItemTypeEntity } from "@framework/entities";
import { PCRRecordTypeMetaValues } from "@server/features/pcrs/getItemTypesQuery";
import { PCRItemForScopeChangeDto, PCRItemForTimeExtensionDto } from "@framework/dtos";

describe("GetPCRByIdQuery", () => {
  test("when id not found then exception is thrown", async () => {
    const context = new TestContext();

    const pcr = context.testData.createPCR();

    const query = new GetPCRByIdQuery(pcr.projectId, pcr.id + "_");
    await expect(context.runQuery(query)).rejects.toThrowError();
  });

  test("when project id found then exception item", async () => {
    const context = new TestContext();

    const pcr = context.testData.createPCR();

    const query = new GetPCRByIdQuery(pcr.projectId, pcr.id);
    const result = await context.runQuery(query);

    expect(result).not.toBeNull();
    expect(result.id).toBe(pcr.id);
  });

  test("maps fields correctly", async () => {
    const context = new TestContext();

    const expectedStartDate = DateTime.local().minus({ days: 2 }).toJSDate();
    const expectedUpdatedDate = DateTime.local().minus({ days: 1 }).toJSDate();
    const pcr = context.testData.createPCR(undefined, {
      number: 5,
      reasoning: "Expected reasoning",
      reasoningStatus: 55,
      reasoningStatusName: "Expected Reasoning Status",
      comments: "Expected comments",
      guidance: "This is some hardcoded guidance",
      started: expectedStartDate,
      updated: expectedUpdatedDate,
      status: 33,
      statusName: "Expected Status name"
    });

    const query = new GetPCRByIdQuery(pcr.projectId, pcr.id);
    const result = await context.runQuery(query);

    expect(result.requestNumber).toBe(5);
    expect(result.guidance).toBe("This is some hardcoded guidance");
    expect(result.reasoningComments).toBe("Expected reasoning");
    expect(result.reasoningStatus).toBe(55);
    expect(result.reasoningStatusName).toBe("Expected Reasoning Status");
    expect(result.comments).toBe("Expected comments");
    expect(result.started).toBe(expectedStartDate);
    expect(result.lastUpdated).toBe(expectedUpdatedDate);
    expect(result.status).toBe(33);
    expect(result.statusName).toBe("Expected Status name");
    expect(result.items).toEqual([]);
  });

  test("returns all items", async () => {
    const context = new TestContext();

    const recordTypes = context.testData.createPCRRecordTypes();

    const pcr = context.testData.createPCR();
    const items = context.testData.range(3, (x,i) => context.testData.createPCRItem(pcr, recordTypes[i]));

    const query = new GetPCRByIdQuery(pcr.projectId, pcr.id);
    const result = await context.runQuery(query);

    expect(result.items.length).toBe(items.length);
    expect(result.items.map(x => x.id)).toEqual(items.map(x => x.id));

  });

  test("maps all item fields", async () => {
    const context = new TestContext();

    const recordType = context.testData.createPCRRecordTypes()[4];

    const pcr = context.testData.createPCR();

    const item = context.testData.createPCRItem(pcr, recordType, {
      status: 98,
      statusName: "Expected Status",
      guidance: "This is some hardcoded guidance"
    });

    const query = new GetPCRByIdQuery(pcr.projectId, pcr.id);
    const result = await context.runQuery(query).then(x => x.items[0]);

    expect(result.id).toBe(item.id);
    expect(result.guidance).toBe("This is some hardcoded guidance");
    expect(result.type).toBe(50);
    expect(result.typeName).toBe(recordType.type);
    expect(result.status).toBe(98);
    expect(result.statusName).toBe("Expected Status");
  });

  test("maps fields for time extension", async () => {
    const context = new TestContext();

    const timeExtensionType = PCRRecordTypeMetaValues.find(x => x.type === ProjectChangeRequestItemTypeEntity.TimeExtension)!;
    const recordType = context.testData.createPCRRecordTypes().find(x => x.type === timeExtensionType.typeName);

    const pcr = context.testData.createPCR();

    const endDate = new Date();
    const item = context.testData.createPCRItem(pcr, recordType, {
      projectEndDate: endDate
    });

    const query = new GetPCRByIdQuery(pcr.projectId, pcr.id);
    const result = await context.runQuery(query).then(x => x.items[0] as PCRItemForTimeExtensionDto);

    expect(result.id).toBe(item.id);
    expect(result.projectEndDate).toBe(endDate);
  });

  test("maps fields for scope change", async () => {
    const context = new TestContext();

    const scopeChangeType = PCRRecordTypeMetaValues.find(x => x.type === ProjectChangeRequestItemTypeEntity.ScopeChange)!;
    const recordType = context.testData.createPCRRecordTypes().find(x => x.type === scopeChangeType.typeName);

    const pcr = context.testData.createPCR();

    const projectSummary = "This is a summary of the project";
    const publicDescription = "This is a public description";

    const item = context.testData.createPCRItem(pcr, recordType, {
      projectSummary,
      publicDescription
    });

    const query = new GetPCRByIdQuery(pcr.projectId, pcr.id);
    const result = await context.runQuery(query).then(x => x.items[0] as PCRItemForScopeChangeDto);

    expect(result.id).toBe(item.id);
    expect(result.projectSummary).toBe(projectSummary);
    expect(result.publicDescription).toBe(publicDescription);
  });

  test("when project id not found then exception is thrown", async () => {
    const context = new TestContext();

    const pcr = context.testData.createPCR();

    const query = new GetPCRByIdQuery(pcr.projectId + "_", pcr.id);
    await expect(context.runQuery(query)).rejects.toThrowError();
  });
});
