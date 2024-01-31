import { GetPCRByIdQuery } from "@server/features/pcrs/getPCRByIdQuery";
import { DateTime } from "luxon";
import { PCRSpendProfileLabourCostDto } from "@framework/dtos/pcrSpendProfileDto";
import { TestContext } from "@tests/test-utils/testContextProvider";
import { CostCategoryType } from "@framework/constants/enums";
import {
  PCRItemStatus,
  PCRStatus,
  PCRItemType,
  PCRProjectRole,
  PCRPartnerType,
  pcrItemTypes,
} from "@framework/constants/pcrConstants";
import { TypeOfAid } from "@framework/constants/project";
import {
  PCRItemForTimeExtensionDto,
  PCRItemForScopeChangeDto,
  PCRItemForAccountNameChangeDto,
  PCRItemForProjectSuspensionDto,
  PCRItemForPartnerAdditionDto,
} from "@framework/dtos/pcrDtos";
import { RecordType } from "@framework/entities/recordType";

describe("GetPCRByIdQuery", () => {
  test("when id not found then exception is thrown", async () => {
    const context = new TestContext();

    const pcr = context.testData.createPCR();

    const query = new GetPCRByIdQuery(pcr.projectId, (pcr.id + "_") as PcrId);
    await expect(context.runQuery(query)).rejects.toThrow();
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
      reasoningStatus: PCRItemStatus.Complete,
      reasoningStatusName: "Expected Reasoning Status",
      comments: "Expected comments",
      started: expectedStartDate,
      updated: expectedUpdatedDate,
      status: PCRStatus.DraftWithProjectManager,
      statusName: "Expected Status name",
    });

    const query = new GetPCRByIdQuery(pcr.projectId, pcr.id);
    const result = await context.runQuery(query);

    expect(result.requestNumber).toBe(5);
    expect(result.reasoningComments).toBe("Expected reasoning");
    expect(result.reasoningStatus).toBe(PCRItemStatus.Complete);
    expect(result.reasoningStatusName).toBe("Expected Reasoning Status");
    expect(result.comments).toBe("Expected comments");
    expect(result.started).toBe(expectedStartDate);
    expect(result.lastUpdated).toBe(expectedUpdatedDate);
    expect(result.status).toBe(PCRStatus.DraftWithProjectManager);
    expect(result.statusName).toBe("Expected Status name");
    expect(result.items).toEqual([]);
  });

  test("returns all items", async () => {
    const context = new TestContext();

    const recordTypes = context.testData.createPCRRecordTypes();

    const pcr = context.testData.createPCR();

    // Avoid using Reallocate items - due to conditional logic
    const items = [
      context.testData.createPCRItem(pcr, recordTypes[2]),
      context.testData.createPCRItem(pcr, recordTypes[3]),
      context.testData.createPCRItem(pcr, recordTypes[4]),
    ];

    const query = new GetPCRByIdQuery(pcr.projectId, pcr.id);
    const result = await context.runQuery(query);

    expect(result.items.length).toBe(items.length);
    expect(result.items.map(x => x.id)).toEqual(items.map(x => x.id));
  });

  test("maps all item fields", async () => {
    const context = new TestContext();

    const recordType = context.testData
      .createPCRRecordTypes()
      .find(x => x.type === "Change project scope") as RecordType;

    const pcr = context.testData.createPCR();

    const item = context.testData.createPCRItem(pcr, recordType, {
      status: PCRItemStatus.Complete,
      statusName: "Expected Status",
      shortName: "If a nickname is what people call you for short, then your full name is your nicholas name",
    });

    const query = new GetPCRByIdQuery(pcr.projectId, pcr.id);
    const result = await context.runQuery(query).then(x => x.items[0]);

    expect(result.id).toBe(item.id);
    expect(result.guidance).toBe(pcrItemTypes.find(x => x.type === PCRItemType.ScopeChange)?.guidance);
    expect(result.type).toBe(PCRItemType.ScopeChange);
    expect(result.typeName).toBe(recordType.type);
    expect(result.status).toBe(PCRItemStatus.Complete);
    expect(result.statusName).toBe("Expected Status");
    expect(result.shortName).toBe(
      "If a nickname is what people call you for short, then your full name is your nicholas name",
    );
  });

  it("returns the item short name if available", async () => {
    const context = new TestContext();
    const pcrItemType = pcrItemTypes.find(x => x.type === PCRItemType.PartnerWithdrawal);
    if (!pcrItemType) throw new Error("pcrItemType not found");
    const recordType = context.testData.createRecordType({
      type: pcrItemType.typeName,
      parent: "Acc_ProjectChangeRequest__c",
    });
    const pcr = context.testData.createPCR();
    context.testData.createPCRItem(pcr, recordType, { shortName: "Get rid" });
    const query = new GetPCRByIdQuery(pcr.projectId, pcr.id);
    const result = await context.runQuery(query);
    expect(result.items[0].shortName).toEqual("Get rid");
  });

  it("returns the item type name if short name is not available", async () => {
    const context = new TestContext();
    const pcrItemType = pcrItemTypes.find(x => x.type === PCRItemType.PartnerWithdrawal);
    if (!pcrItemType) throw new Error("pcrItemType not found");
    const recordType = context.testData.createRecordType({
      type: pcrItemType.typeName,
      parent: "Acc_ProjectChangeRequest__c",
    });
    const pcr = context.testData.createPCR();
    context.testData.createPCRItem(pcr, recordType, { shortName: undefined });
    const query = new GetPCRByIdQuery(pcr.projectId, pcr.id);
    const result = await context.runQuery(query);
    expect(result.items[0].shortName).toEqual(recordType.type);
  });

  test("maps fields for time extension", async () => {
    const context = new TestContext();

    const timeExtensionType = pcrItemTypes.find(x => x.type === PCRItemType.TimeExtension);
    const recordType = context.testData.createPCRRecordTypes().find(x => x.type === timeExtensionType?.typeName);

    const pcr = context.testData.createPCR();
    const offsetMonths = 5;
    const projectDurationSnapshot = 4;
    const item = context.testData.createPCRItem(pcr, recordType, {
      offsetMonths,
      projectDurationSnapshot,
    });

    const query = new GetPCRByIdQuery(pcr.projectId, pcr.id);
    const result = await context.runQuery(query).then(x => x.items[0] as PCRItemForTimeExtensionDto);

    expect(result.id).toBe(item.id);
    expect(result.offsetMonths).toBe(offsetMonths);
    expect(result.projectDurationSnapshot).toBe(projectDurationSnapshot);
  });

  test("maps fields for scope change", async () => {
    const context = new TestContext();

    const scopeChangeType = pcrItemTypes.find(x => x.type === PCRItemType.ScopeChange);
    const recordType = context.testData.createPCRRecordTypes().find(x => x.type === scopeChangeType?.typeName);

    const pcr = context.testData.createPCR();

    const projectSummary = "This is a summary of the project";
    const publicDescription = "This is a public description";
    const projectSummarySnapshot = "This is a summary snapshot";
    const publicDescriptionSnapshot = "This is a description snapshot";

    const item = context.testData.createPCRItem(pcr, recordType, {
      projectSummary,
      publicDescription,
      projectSummarySnapshot,
      publicDescriptionSnapshot,
    });

    const query = new GetPCRByIdQuery(pcr.projectId, pcr.id);
    const result = await context.runQuery(query).then(x => x.items[0] as PCRItemForScopeChangeDto);

    expect(result.id).toBe(item.id);
    expect(result.projectSummary).toBe(projectSummary);
    expect(result.publicDescription).toBe(publicDescription);
    expect(result.publicDescriptionSnapshot).toBe(publicDescriptionSnapshot);
    expect(result.projectSummarySnapshot).toBe(projectSummarySnapshot);
    expect(result.guidance).toBe(pcrItemTypes.find(x => x.type === PCRItemType.ScopeChange)?.guidance);
  });

  test("maps fields for account name change", async () => {
    const context = new TestContext();

    const accountNameChangeType = pcrItemTypes.find(x => x.type === PCRItemType.AccountNameChange);
    const project = context.testData.createProject();
    const partner = context.testData.createPartner(project);
    const recordType = context.testData.createPCRRecordTypes().find(x => x.type === accountNameChangeType?.typeName);

    const pcr = context.testData.createPCR(project);

    const accountName = "Projectus Partnerus The Bestus";
    const partnerNameSnapshot = "Projectus Monitoringus the Officerus";

    const item = context.testData.createPCRItem(pcr, recordType, {
      accountName,
      partnerNameSnapshot,
      partnerId: partner.id,
    });

    const query = new GetPCRByIdQuery(pcr.projectId, pcr.id);
    const result = await context.runQuery(query).then(x => x.items[0] as PCRItemForAccountNameChangeDto);

    expect(result.id).toBe(item.id);
    expect(result.accountName).toBe(accountName);
    expect(result.partnerNameSnapshot).toBe(partnerNameSnapshot);
    expect(result.partnerId).toBe(partner.id);
    expect(result.guidance).toBe(pcrItemTypes.find(x => x.type === PCRItemType.AccountNameChange)?.guidance);
  });

  test("maps fields for project suspension", async () => {
    const context = new TestContext();

    const projectSuspensionType = pcrItemTypes.find(x => x.type === PCRItemType.ProjectSuspension);
    const recordType = context.testData.createPCRRecordTypes().find(x => x.type === projectSuspensionType?.typeName);

    const pcr = context.testData.createPCR();

    const suspensionStartDate = DateTime.local().plus({ years: 1 }).startOf("month").toJSDate();
    const suspensionEndDate = DateTime.local().plus({ years: 2 }).endOf("month").toJSDate();

    const item = context.testData.createPCRItem(pcr, recordType, {
      suspensionStartDate,
      suspensionEndDate,
    });

    const query = new GetPCRByIdQuery(pcr.projectId, pcr.id);
    const result = await context.runQuery(query).then(x => x.items[0] as PCRItemForProjectSuspensionDto);

    expect(result.id).toBe(item.id);
    expect(result.suspensionStartDate?.toISOString()).toBe(suspensionStartDate.toISOString());
    expect(result.suspensionEndDate?.toISOString()).toBe(suspensionEndDate.toISOString());
  });

  describe("partner addition", () => {
    test("maps fields for partner addition pcr item", async () => {
      const context = new TestContext();

      const partnerAdditionType = pcrItemTypes.find(x => x.type === PCRItemType.PartnerAddition);
      const recordType = context.testData.createPCRRecordTypes().find(x => x.type === partnerAdditionType?.typeName);

      const pcr = context.testData.createPCR();

      const projectRole = PCRProjectRole.Collaborator;
      const partnerType = PCRPartnerType.ResearchAndTechnology;
      const projectCity = "Bristol";
      const projectPostcode = "BS! 5UW";
      const awardRate = 35;
      const typeOfAid = TypeOfAid.DeMinimisAid;

      const item = context.testData.createPCRItem(pcr, recordType, {
        projectRole,
        partnerType,
        projectCity,
        projectPostcode,
        awardRate,
        typeOfAid,
      });

      const query = new GetPCRByIdQuery(pcr.projectId, pcr.id);
      const result = await context.runQuery(query).then(x => x.items[0] as PCRItemForPartnerAdditionDto);

      expect(result.id).toBe(item.id);
      expect(result.projectRole).toBe(projectRole);
      expect(result.partnerType).toBe(partnerType);
      expect(result.projectCity).toBe(projectCity);
      expect(result.projectPostcode).toBe(projectPostcode);
      expect(result.awardRate).toBe(awardRate);
      expect(result.typeOfAid).toBe(typeOfAid);
    });

    test("maps fields for partner addition pcr spend profile for Labour", async () => {
      const context = new TestContext();

      const partnerAdditionType = pcrItemTypes.find(x => x.type === PCRItemType.PartnerAddition);
      const recordType = context.testData.createPCRRecordTypes().find(x => x.type === partnerAdditionType?.typeName);
      const pcr = context.testData.createPCR();
      const costCategoryLabour = context.testData.createCostCategory({ name: "Labour", type: CostCategoryType.Labour });

      const projectRole = PCRProjectRole.Collaborator;
      const partnerType = PCRPartnerType.ResearchAndTechnology;

      const item = context.testData.createPCRItem(pcr, recordType, { projectRole, partnerType });
      await context.testData.createPcrSpendProfile({
        costCategory: costCategoryLabour,
        pcrItem: item,
        update: {
          value: 50,
        },
      });

      const query = new GetPCRByIdQuery(pcr.projectId, pcr.id);
      const result = await context.runQuery(query).then(x => x.items[0] as PCRItemForPartnerAdditionDto);

      expect(result.id).toBe(item.id);
      const spendProfile = result.spendProfile;
      expect(spendProfile).toBeDefined();
      expect(spendProfile.costs).toHaveLength(1);
      const labourCost = spendProfile.costs[0] as PCRSpendProfileLabourCostDto;
      expect(labourCost.costCategory).toBe(CostCategoryType.Labour);
      expect(labourCost.costCategoryId).toBe(costCategoryLabour.id);
      expect(labourCost.value).toBe(50);
    });
  });

  test("when project id not found then exception is thrown", async () => {
    const context = new TestContext();

    const pcr = context.testData.createPCR();

    const query = new GetPCRByIdQuery((pcr.projectId + "_") as ProjectId, pcr.id);
    await expect(context.runQuery(query)).rejects.toThrow();
  });
});
