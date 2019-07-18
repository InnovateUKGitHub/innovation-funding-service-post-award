import { TestContext } from "../../testContextProvider";
import { BadRequestError, ValidationError } from "@server/features/common/appError";
import { Authorisation, ProjectRole } from "@framework/types";
import { mapClaimDetails } from "@server/features/claimDetails/mapClaimDetails";
import { SaveClaimDetails } from "@server/features/claimDetails/saveClaimDetailsCommand";
import { ISalesforceClaimDetails, ISalesforcePartner } from "@server/repositories";
import { CostCategory } from "@framework/entities";

const createNewLineItemDto = (detail: ClaimDetailsDto, value?: number, description?: string): ClaimLineItemDto => {
  return ({
    id: "",
    costCategoryId: detail.costCategoryId,
    partnerId: detail.partnerId,
    periodId: detail.periodId,
    value: value || 100,
    description: description || "A desciption"
  });
};

const createNewDto = (partner: ISalesforcePartner, periodId: number, costCategory: CostCategory): ClaimDetailsDto => {
  return {
    partnerId: partner.Id,
    comments: "",
    lineItems: [],
    costCategoryId: costCategory.id,
    value: 0,
    periodId,
    periodStart: new Date(),
    periodEnd: new Date(),
  };
};

const createDto = (context: TestContext, claimDetails: ISalesforceClaimDetails) => {
  const lineItems = context.repositories.claimLineItems.Items.filter(x =>
    x.Acc_CostCategory__c === claimDetails.Acc_CostCategory__c &&
    x.Acc_ProjectParticipant__c === claimDetails.Acc_ProjectParticipant__r.Id &&
    x.Acc_ProjectPeriodNumber__c === claimDetails.Acc_ProjectPeriodNumber__c
  );

  return mapClaimDetails(claimDetails, lineItems, context);
};

// tslint:disable-next-line:no-big-function
describe("SaveClaimDetails", () => {

  it("should save the comments field", async () => {
    const context = new TestContext();
    const project = context.testData.createProject();
    const partner = context.testData.createPartner(project);
    const costCategory = context.testData.createCostCategory();
    const periodId = 1;
    const sfClaimDetails = context.testData.createClaimDetail(project, costCategory, partner, periodId);

    const dto = createDto(context, sfClaimDetails);
    dto.comments = "this is a comment";

    const command = new SaveClaimDetails(project.Id, partner.Id, dto.periodId, dto.costCategoryId, dto);
    await context.runCommand(command);

    expect(context.repositories.claimDetails.Items).toHaveLength(1);
    expect(context.repositories.claimDetails.Items.find(x => x.Acc_CostCategory__c === costCategory.id && x.Acc_ProjectParticipant__r.Id === partner.Id && x.Acc_ProjectPeriodNumber__c === periodId)!.Acc_ReasonForDifference__c).toEqual("this is a comment");
  });

  it("should return a validation error if the line items passed is missing a description", async () => {
    const context = new TestContext();
    const project = context.testData.createProject();
    const partner = context.testData.createPartner(project);
    const costCategory = context.testData.createCostCategory();
    const claimDetails = context.testData.createClaimDetail(project, costCategory, partner);
    expect(context.repositories.claimLineItems.Items).toHaveLength(0);

    const dto = createDto(context, claimDetails);

    const lineItem = createNewLineItemDto(dto);
    lineItem.description = "";

    dto.lineItems = [lineItem];

    const command = new SaveClaimDetails(project.Id, partner.Id, claimDetails.Acc_ProjectPeriodNumber__c, costCategory.id, dto);
    await expect(context.runCommand(command)).rejects.toThrow(ValidationError);
    expect(context.repositories.claimLineItems.Items).toHaveLength(0);
  });

  it("should return a validation error if the line items passed is invalid cost", async () => {
    const context = new TestContext();
    const project = context.testData.createProject();
    const partner = context.testData.createPartner(project);
    const costCategory = context.testData.createCostCategory();
    const claimDetails = context.testData.createClaimDetail(project, costCategory, partner);

    expect(context.repositories.claimLineItems.Items).toHaveLength(0);

    const dto = createDto(context, claimDetails);

    const lineItem = createNewLineItemDto(dto);
    lineItem.value = NaN;

    dto.lineItems = [lineItem];

    const command = new SaveClaimDetails(project.Id, partner.Id, claimDetails.Acc_ProjectPeriodNumber__c, costCategory.id, dto);
    await expect(context.runCommand(command)).rejects.toThrow(ValidationError);
    expect(context.repositories.claimLineItems.Items).toHaveLength(0);
  });

  it("should return a validation error if the line items passed is missing a cost", async () => {
    const context = new TestContext();
    const project = context.testData.createProject();
    const partner = context.testData.createPartner(project);
    const costCategory = context.testData.createCostCategory();
    const claimDetails = context.testData.createClaimDetail(project, costCategory, partner);

    const dto = createDto(context, claimDetails);
    const lineItem = createNewLineItemDto(dto);
    lineItem.value = null as any;
    dto.lineItems = [lineItem];

    expect(context.repositories.claimLineItems.Items).toHaveLength(0);

    const command = new SaveClaimDetails(project.Id, partner.Id, claimDetails.Acc_ProjectPeriodNumber__c, costCategory.id, dto);
    await expect(context.runCommand(command)).rejects.toThrow(ValidationError);
    expect(context.repositories.claimLineItems.Items).toHaveLength(0);
  });

  it("should insert new line items", async () => {
    const context = new TestContext();
    const project = context.testData.createProject();
    const partner = context.testData.createPartner(project);
    const costCategory = context.testData.createCostCategory();
    const periodId = 3;
    const claimDetails = context.testData.createClaimDetail(project, costCategory, partner, periodId);

    expect(context.repositories.claimLineItems.Items).toHaveLength(0);

    const expectedValue = 1000;
    const expectedDescription = "Line itme comment";

    const dto = createDto(context, claimDetails);
    const lineItem = createNewLineItemDto(dto, expectedValue, expectedDescription);
    dto.lineItems = [lineItem];

    const command = new SaveClaimDetails(project.Id, partner.Id, periodId, costCategory.id, dto);
    await context.runCommand(command);

    expect(context.repositories.claimLineItems.Items).toHaveLength(1);
    expect(context.repositories.claimLineItems.Items[0].Acc_CostCategory__c).toEqual(costCategory.id);
    expect(context.repositories.claimLineItems.Items[0].Acc_LineItemCost__c).toEqual(expectedValue);
    expect(context.repositories.claimLineItems.Items[0].Acc_LineItemDescription__c).toEqual(expectedDescription);
    expect(context.repositories.claimLineItems.Items[0].Acc_ProjectParticipant__c).toEqual(partner.Id);
    expect(context.repositories.claimLineItems.Items[0].Acc_ProjectPeriodNumber__c).toEqual(periodId);
  });

  it("should update existing line items", async () => {
    const context = new TestContext();
    const project = context.testData.createProject();
    const partner = context.testData.createPartner(project);
    const costCategory = context.testData.createCostCategory();
    const claimDetails = context.testData.createClaimDetail(project, costCategory, partner);
    const claimLineItem = context.testData.createClaimLineItem(costCategory, partner, claimDetails.Acc_ProjectPeriodNumber__c);

    expect(context.repositories.claimLineItems.Items).toHaveLength(1);

    const dto = createDto(context, claimDetails);
    dto.lineItems[0].description = "new description!";
    dto.lineItems[0].value = 1234;

    const command = new SaveClaimDetails(project.Id, partner.Id, claimDetails.Acc_ProjectPeriodNumber__c, costCategory.id, dto);
    await context.runCommand(command);

    expect(context.repositories.claimLineItems.Items).toHaveLength(1);
    expect(context.repositories.claimLineItems.Items[0]).toEqual({
      ...claimLineItem,
      Acc_LineItemDescription__c: "new description!",
      Acc_LineItemCost__c: 1234
    });
  });

  it("should delete items not passed in", async () => {
    const context = new TestContext();
    const project = context.testData.createProject();
    const partner = context.testData.createPartner(project);
    const costCategory = context.testData.createCostCategory();
    const periodId = 1;
    const claimDetails = context.testData.createClaimDetail(project, costCategory, partner, periodId);
    const claimLineItem1 = context.testData.createClaimLineItem(costCategory, partner, periodId);
    const claimLineItem2 = context.testData.createClaimLineItem(costCategory, partner, periodId);

    expect(context.repositories.claimLineItems.Items).toHaveLength(2);
    expect(context.repositories.claimLineItems.Items[0]).toEqual(expect.objectContaining(claimLineItem1));
    expect(context.repositories.claimLineItems.Items[1]).toEqual(expect.objectContaining(claimLineItem2));

    const dto = createDto(context, claimDetails);
    dto.lineItems.pop();

    const command = new SaveClaimDetails(project.Id, partner.Id, periodId, costCategory.id, dto);
    await context.runCommand(command);
    expect(context.repositories.claimLineItems.Items).toHaveLength(1);
    expect(context.repositories.claimLineItems.Items[0]).toEqual(claimLineItem1);
  });

  test("expect comments to be updated", async () => {
    const context = new TestContext();
    const project = context.testData.createProject();
    const partner = context.testData.createPartner();
    const costCategory = context.testData.createCostCategory();
    const claimDetail = context.testData.createClaimDetail(project, costCategory, partner, 1, x => x.Acc_ReasonForDifference__c = "An old message");
    const dto = createDto(context, claimDetail);
    dto.comments = "A new message";

    const command = new SaveClaimDetails(project.Id, partner.Id, 1, costCategory.id, dto);
    await context.runCommand(command);

    expect(claimDetail.Acc_ReasonForDifference__c).toBe("A new message");
  });

  test("expect comments to be null", async () => {
    const context = new TestContext();
    const project = context.testData.createProject();
    const partner = context.testData.createPartner();
    const costCategory = context.testData.createCostCategory();
    const claimDetail = context.testData.createClaimDetail(project, costCategory, partner, 1, x => x.Acc_ReasonForDifference__c = "An old message");
    const dto = createDto(context, claimDetail);
    dto.comments = null;

    const command = new SaveClaimDetails(project.Id, partner.Id, 1, costCategory.id, dto);
    await context.runCommand(command);

    expect(claimDetail.Acc_ReasonForDifference__c).toBe(null);
  });

  test("if no claim detail will create claim detail with no line items", async () => {
    const context = new TestContext();
    const costCategory = context.testData.createCostCategory();

    const partner = context.testData.createPartner();
    const periodId = 1;

    const dto = createNewDto(partner, periodId, costCategory);
    dto.comments = "Test comments";

    expect(context.repositories.claimDetails.Items.length).toBe(0);
    expect(context.repositories.claimLineItems.Items.length).toBe(0);

    const command = new SaveClaimDetails(partner.Acc_ProjectId__r.Id, partner.Id, periodId, costCategory.id, dto);
    await context.runCommand(command);

    expect(context.repositories.claimDetails.Items.length).toBe(1);
    expect(context.repositories.claimLineItems.Items.length).toBe(0);
    expect(context.repositories.claimDetails.Items[0].Acc_CostCategory__c).toBe(costCategory.id);
    expect(context.repositories.claimDetails.Items[0].Acc_ReasonForDifference__c).toBe("Test comments");

  });

  test("if no claim detail will create claim detail with line items", async () => {
    const context = new TestContext();
    const costCategory = context.testData.createCostCategory();

    const partner = context.testData.createPartner();
    const periodId = 1;

    const dto = createNewDto(partner, periodId, costCategory);

    dto.lineItems = [
      createNewLineItemDto(dto, 10, "First line item"),
      createNewLineItemDto(dto, 10, "Second line item"),
    ];

    expect(context.repositories.claimLineItems.Items.length).toBe(0);

    const command = new SaveClaimDetails(partner.Acc_ProjectId__r.Id, partner.Id, periodId, costCategory.id, dto);
    await context.runCommand(command);

    expect(context.repositories.claimLineItems.Items.length).toBe(2);
    expect(context.repositories.claimLineItems.Items[0].Acc_LineItemDescription__c).toBe("First line item");
    expect(context.repositories.claimLineItems.Items[1].Acc_LineItemDescription__c).toBe("Second line item");
  });

  describe("validateRequest", () => {
    test("invalid project id throws error", async () => {
      const context = new TestContext();
      const project = context.testData.createProject();
      const partner = context.testData.createPartner();
      const costCategory = context.testData.createCostCategory();
      const claimDetail = context.testData.createClaimDetail(project, costCategory, partner, 1);
      const dto = createDto(context, claimDetail);

      const command = new SaveClaimDetails(null as any, partner.Id, 1, costCategory.id, dto);
      await expect(context.runCommand(command)).rejects.toThrow(BadRequestError);
    });

    test("invalid partner id throws error", async () => {
      const context = new TestContext();
      const project = context.testData.createProject();
      const partner = context.testData.createPartner();
      const costCategory = context.testData.createCostCategory();
      const claimDetail = context.testData.createClaimDetail(project, costCategory, partner, 1);
      const dto = createDto(context, claimDetail);

      const command = new SaveClaimDetails(project.Id, null as any, 1, costCategory.id, dto);
      await expect(context.runCommand(command)).rejects.toThrow(BadRequestError);
    });

    test("mismatched partner id throws error", async () => {
      const context = new TestContext();
      const project = context.testData.createProject();
      const partner = context.testData.createPartner();
      const costCategory = context.testData.createCostCategory();
      const claimDetail = context.testData.createClaimDetail(project, costCategory, partner, 1);
      const dto = createDto(context, claimDetail);
      dto.partnerId = "Invalid";

      const command = new SaveClaimDetails(project.Id, partner.Id, 1, costCategory.id, dto);
      await expect(context.runCommand(command)).rejects.toThrow(BadRequestError);
    });

    test("invalid periodId throws error", async () => {
      const context = new TestContext();
      const project = context.testData.createProject();
      const partner = context.testData.createPartner();
      const costCategory = context.testData.createCostCategory();
      const claimDetail = context.testData.createClaimDetail(project, costCategory, partner, 1);
      const dto = createDto(context, claimDetail);

      const command = new SaveClaimDetails(project.Id, partner.Id, null as any, costCategory.id, dto);
      await expect(context.runCommand(command)).rejects.toThrow(BadRequestError);
    });

    test("invalid costCategory id throws error", async () => {
      const context = new TestContext();
      const project = context.testData.createProject();
      const partner = context.testData.createPartner();
      const costCategory = context.testData.createCostCategory();
      const claimDetail = context.testData.createClaimDetail(project, costCategory, partner, 1);
      const dto = createDto(context, claimDetail);

      const command = new SaveClaimDetails(project.Id, partner.Id, 1, null as any, dto);
      await expect(context.runCommand(command)).rejects.toThrow(BadRequestError);
    });

    test("lineItems mismatched periodId throws error", async () => {
      const context = new TestContext();
      const project = context.testData.createProject();
      const partner = context.testData.createPartner();
      const costCategory = context.testData.createCostCategory();
      const claimDetail = context.testData.createClaimDetail(project, costCategory, partner, 1);

      const dto = createDto(context, claimDetail);
      const lineItem = createNewLineItemDto(dto);
      lineItem.periodId = 2;

      dto.lineItems = [lineItem];

      const command = new SaveClaimDetails(project.Id, partner.Id, 1, costCategory.id, dto);
      await expect(context.runCommand(command)).rejects.toThrow(BadRequestError);
    });

    test("lineItems mismatched partner Id throws error", async () => {
      const context = new TestContext();
      const project = context.testData.createProject();
      const partner = context.testData.createPartner();
      const costCategory = context.testData.createCostCategory();
      const claimDetail = context.testData.createClaimDetail(project, costCategory, partner, 1);

      const dto = createDto(context, claimDetail);
      const lineItem = createNewLineItemDto(dto);
      lineItem.partnerId = "Invalid";

      dto.lineItems = [lineItem];

      const command = new SaveClaimDetails(project.Id, partner.Id, 1, costCategory.id, dto);
      await expect(context.runCommand(command)).rejects.toThrow(BadRequestError);
    });

    test("lineItems mismatched costCategory Id throws error", async () => {
      const context = new TestContext();
      const project = context.testData.createProject();
      const partner = context.testData.createPartner();
      const costCategory = context.testData.createCostCategory();
      const claimDetail = context.testData.createClaimDetail(project, costCategory, partner, 1);

      const dto = createDto(context, claimDetail);
      const lineItem = createNewLineItemDto(dto);
      lineItem.costCategoryId = "Invalid";
      dto.lineItems = [lineItem];

      const command = new SaveClaimDetails(project.Id, partner.Id, 1, costCategory.id, dto);
      await expect(context.runCommand(command)).rejects.toThrow(BadRequestError);
    });

  });

  describe("Overheads calulation", () => {

    const createRelatedCostCategories = (context: TestContext) => {
      return {
        labour: context.testData.createCostCategory({ hasRelated: true }),
        overheads: context.testData.createCostCategory({ isCalculated: true }),
      };
    };

    test("If updating Labour will add overheads line item", async () => {
      const context = new TestContext();

      const { labour, overheads } = createRelatedCostCategories(context);

      const periodId = 2;
      const project = context.testData.createProject();
      const partner = context.testData.createPartner(project, x => x.Acc_OverheadRate__c = 20);

      const labourClaimDetail = context.testData.createClaimDetail(project, labour, partner, periodId);

      expect(context.repositories.claimLineItems.Items.length).toBe(0);

      const dto = createDto(context, labourClaimDetail);
      dto.lineItems = [
        createNewLineItemDto(dto, 100),
        createNewLineItemDto(dto, 100),
      ];

      const command = new SaveClaimDetails(partner.Acc_ProjectId__r.Id, partner.Id, periodId, labour.id, dto);
      await context.runCommand(command);

      expect(context.repositories.claimLineItems.Items.length).toBe(3);
      expect(context.repositories.claimLineItems.Items.map(x => x.Acc_CostCategory__c)).toEqual([labour.id, labour.id, overheads.id]);

      const overheadsLineItem = context.repositories.claimLineItems.Items.find(x => x.Acc_CostCategory__c === overheads.id)!;

      expect(overheadsLineItem.Acc_LineItemCost__c).toBe(40);

    });

    test("If updating Labour will udpate exiting overheads line item", async () => {
      const context = new TestContext();

      const { labour, overheads } = createRelatedCostCategories(context);

      const periodId = 2;
      const project = context.testData.createProject();
      const partner = context.testData.createPartner(project, x => x.Acc_OverheadRate__c = 30);

      const labourClaimDetail = context.testData.createClaimDetail(project, labour, partner, periodId);

      context.testData.createClaimLineItem(overheads, partner, periodId, x => {
        x.Acc_LineItemCost__c = 100;
      });

      expect(context.repositories.claimLineItems.Items.length).toBe(1);

      const dto = createDto(context, labourClaimDetail);
      dto.lineItems = [
        createNewLineItemDto(dto, 200),
        createNewLineItemDto(dto, 200),
      ];

      const command = new SaveClaimDetails(partner.Acc_ProjectId__r.Id, partner.Id, periodId, labour.id, dto);
      await context.runCommand(command);

      expect(context.repositories.claimLineItems.Items.length).toBe(3);
      expect(context.repositories.claimLineItems.Items.map(x => x.Acc_CostCategory__c)).toEqual([overheads.id, labour.id, labour.id]);

      const overheadsLineItem = context.repositories.claimLineItems.Items.find(x => x.Acc_CostCategory__c === overheads.id)!;

      expect(overheadsLineItem.Acc_LineItemCost__c).toBe(120);
    });

    test("If multiple overhead categories will use one related to partner comp type and org type", async () => {
      const context = new TestContext();

      // make first 2 one comp / org and second 2 a different comp / org
      const costCategories = [
        context.testData.createCostCategory({ hasRelated: true, competitionType: "COMP_1", organisationType: "ORG_1" }),
        context.testData.createCostCategory({ isCalculated: true, competitionType: "COMP_1", organisationType: "ORG_1" }),
        context.testData.createCostCategory({ hasRelated: true, competitionType: "COMP_2", organisationType: "ORG_2" }),
        context.testData.createCostCategory({ isCalculated: true, competitionType: "COMP_2", organisationType: "ORG_2" }),
      ];

      const labourToUse = costCategories[2];
      const overheadsToExpect = costCategories[3];

      const periodId = 2;
      const project = context.testData.createProject(x => x.Acc_CompetitionType__c = labourToUse.competitionType);
      const partner = context.testData.createPartner(project, x => x.Acc_OrganisationType__c = labourToUse.organisationType);

      const labourClaimDetail = context.testData.createClaimDetail(project, labourToUse, partner, periodId);

      expect(context.repositories.claimLineItems.Items.length).toBe(0);

      const dto = createDto(context, labourClaimDetail);

      const command = new SaveClaimDetails(partner.Acc_ProjectId__r.Id, partner.Id, periodId, labourToUse.id, dto);
      await context.runCommand(command);

      expect(context.repositories.claimLineItems.Items.length).toBe(1);
      const overheadsLineItem = context.repositories.claimLineItems.Items[0];

      expect(overheadsLineItem.Acc_CostCategory__c).toBe(overheadsToExpect.id);
      expect(overheadsLineItem.Acc_LineItemCost__c).toBe(0);
    });

    test("overheads calulation handle empty values", async () => {
      const context = new TestContext();

      const { labour, overheads } = createRelatedCostCategories(context);

      const periodId = 1;
      const project = context.testData.createProject();
      const partner = context.testData.createPartner(project, x => x.Acc_OverheadRate__c = 20);

      const dto = createNewDto(partner, periodId, labour);

      const lineItem = createNewLineItemDto(dto, 200);

      const emptyLineItem = createNewLineItemDto(dto);
      emptyLineItem.value = undefined as any;
      emptyLineItem.description = undefined as any;

      dto.lineItems = [lineItem, emptyLineItem];

      const command = new SaveClaimDetails(partner.Acc_ProjectId__r.Id, partner.Id, periodId, labour.id, dto);
      await context.runCommand(command);

      expect(context.repositories.claimLineItems.Items.length).toBe(2);
      expect(context.repositories.claimLineItems.Items[0].Acc_CostCategory__c).toBe(labour.id);
      expect(context.repositories.claimLineItems.Items[1].Acc_CostCategory__c).toBe(overheads.id);
      expect(context.repositories.claimLineItems.Items[1].Acc_LineItemCost__c).toBe(200 * 0.2);

    });

    test("overheads not calcuated if calculateOverheads is false", async () => {
      const context = new TestContext();
      context.config.features.calculateOverheads = false;

      const { labour } = createRelatedCostCategories(context);

      const periodId = 1;
      const project = context.testData.createProject();
      const partner = context.testData.createPartner(project, x => x.Acc_OverheadRate__c = 20);

      const dto = createNewDto(partner, periodId, labour);
      dto.lineItems = [
        createNewLineItemDto(dto, 200, "Line 1"),
      ];

      const command = new SaveClaimDetails(partner.Acc_ProjectId__r.Id, partner.Id, periodId, labour.id, dto);
      await context.runCommand(command);

      expect(context.repositories.claimLineItems.Items.length).toBe(1);
      expect(context.repositories.claimLineItems.Items[0].Acc_CostCategory__c).toBe(labour.id);

    });
  });

  describe("accessControl", () => {
    test("accessControl - Partner Finance contact passes", async () => {
      const context = new TestContext();
      const project = context.testData.createProject();
      const partner = context.testData.createPartner();
      const costCategory = context.testData.createCostCategory();

      const dto = createNewDto(partner, 1, costCategory);

      const command = new SaveClaimDetails(project.Id, partner.Id, 1, costCategory.id, dto);
      const auth = new Authorisation({
        [project.Id]: {
          projectRoles: ProjectRole.Unknown,
          partnerRoles: { [partner.Id]: ProjectRole.FinancialContact }
        }
      });

      expect(await context.runAccessControl(auth, command)).toBe(true);
    });

    test("accessControl - all other roles fail", async () => {
      const context = new TestContext();
      const project = context.testData.createProject();
      const partner = context.testData.createPartner();
      const costCategory = context.testData.createCostCategory();

      const dto = createNewDto(partner, 1, costCategory);

      const command = new SaveClaimDetails(project.Id, partner.Id, 1, costCategory.id, dto);
      const auth = new Authorisation({
        [project.Id]: {
          projectRoles: ProjectRole.FinancialContact | ProjectRole.MonitoringOfficer | ProjectRole.ProjectManager,
          partnerRoles: { [partner.Id]: ProjectRole.MonitoringOfficer | ProjectRole.ProjectManager }
        }
      });

      expect(await context.runAccessControl(auth, command)).toBe(false);
    });
  });
});
