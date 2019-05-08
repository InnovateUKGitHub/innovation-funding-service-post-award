import { TestContext } from "../../testContextProvider";
import { BadRequestError, ValidationError } from "@server/features/common/appError";
import * as Repositories from "@server/repositories";
import { Authorisation, ProjectRole } from "@framework/types";
import { mapClaimDetails } from "@server/features/claimDetails/mapClaimDetails";
import { SaveClaimDetails } from "@server/features/claimDetails/saveClaimDetailsCommand";
import mapClaimLineItem from "@server/features/claimDetails/mapClaimLineItem";

// tslint:disable-next-line:no-big-function
describe("SaveClaimDetails", () => {

  it("should save the comments field", async () => {
    const context = new TestContext();
    const project = context.testData.createProject();
    const partner = context.testData.createPartner(project);
    const costCategory = context.testData.createCostCategory();
    const sfClaimDetails = context.testData.createClaimDetail(project, costCategory, partner);
    const sfLineItem = context.testData.createClaimLineItem({ costCategory, partner, periodId: sfClaimDetails.Acc_ProjectPeriodNumber__c, persist: false }) as Repositories.ISalesforceClaimLineItem;
    const claimDetails = mapClaimDetails(sfClaimDetails, [sfLineItem], context);

    const dto = {
      ...claimDetails,
      comments: "this is a comment"
    };

    const command = new SaveClaimDetails(project.Id, partner.Id, dto.periodId, dto.costCategoryId, dto);
    await context.runCommand(command);

    expect(context.repositories.claimDetails.Items).toHaveLength(1);
    expect(context.repositories.claimDetails.Items.find(x => x.Id === claimDetails.id)!.Acc_ReasonForDifference__c).toEqual("this is a comment");
  });

  it("should return a validation error if the line items passed is missing a description", async () => {
    const context = new TestContext();
    const project = context.testData.createProject();
    const partner = context.testData.createPartner(project);
    const costCategory = context.testData.createCostCategory();
    const claimDetails = context.testData.createClaimDetail(project, costCategory, partner);
    const claimLineItem = context.testData.createClaimLineItem({
      costCategory,
      partner,
      periodId: claimDetails.Acc_ProjectPeriodNumber__c,
      persist: false,
      update: (item) => {
        delete item.Acc_LineItemDescription__c;
      }
    });

    expect(context.repositories.claimLineItems.Items).toHaveLength(0);

    const lineItem = mapClaimLineItem()(claimLineItem as Repositories.ISalesforceClaimLineItem);

    const dto: ClaimDetailsDto = {
      lineItems: [lineItem],
      id: claimDetails.Id,
      comments: claimDetails.Acc_ReasonForDifference__c
    } as ClaimDetailsDto;

    const command = new SaveClaimDetails(project.Id, partner.Id, claimDetails.Acc_ProjectPeriodNumber__c, costCategory.Id, dto);
    await expect(context.runCommand(command)).rejects.toThrow(ValidationError);
    expect(context.repositories.claimLineItems.Items).toHaveLength(0);
  });

  it("should return a validation error if the line items passed is missing a cost", async () => {
    const context = new TestContext();
    const project = context.testData.createProject();
    const partner = context.testData.createPartner(project);
    const costCategory = context.testData.createCostCategory();
    const claimDetails = context.testData.createClaimDetail(project, costCategory, partner);

    const claimLineItem = context.testData.createClaimLineItem({
      costCategory,
      partner,
      periodId: claimDetails.Acc_ProjectPeriodNumber__c,
      persist: false,
      update: (item) => {
        delete item.Acc_LineItemCost__c;
      }
    });

    const lineItem = mapClaimLineItem()(claimLineItem as Repositories.ISalesforceClaimLineItem);

    expect(context.repositories.claimLineItems.Items).toHaveLength(0);

    const dto: ClaimDetailsDto = {
      lineItems: [lineItem],
      id: claimDetails.Id,
      comments: claimDetails.Acc_ReasonForDifference__c
    } as ClaimDetailsDto;

    const command = new SaveClaimDetails(project.Id, partner.Id, claimDetails.Acc_ProjectPeriodNumber__c, costCategory.Id, dto);
    await expect(context.runCommand(command)).rejects.toThrow(ValidationError);
    expect(context.repositories.claimLineItems.Items).toHaveLength(0);
  });

  it("should insert new line items", async () => {
    const context = new TestContext();
    const project = context.testData.createProject();
    const partner = context.testData.createPartner(project);
    const costCategory = context.testData.createCostCategory();
    const claimDetails = context.testData.createClaimDetail(project, costCategory, partner);
    const claimLineItem = context.testData.createClaimLineItem({ costCategory, partner, periodId: claimDetails.Acc_ProjectPeriodNumber__c, persist: false});
    const lineItem = mapClaimLineItem()(claimLineItem as Repositories.ISalesforceClaimLineItem);

    expect(context.repositories.claimLineItems.Items).toHaveLength(0);

    const dto: ClaimDetailsDto = {
      id: claimDetails.Id,
      lineItems: [lineItem]
    } as ClaimDetailsDto;

    const command = new SaveClaimDetails(project.Id, partner.Id, claimDetails.Acc_ProjectPeriodNumber__c, costCategory.Id, dto);
    await context.runCommand(command);

    expect(context.repositories.claimLineItems.Items).toHaveLength(1);
    expect(context.repositories.claimLineItems.Items[0]).toEqual(expect.objectContaining(claimLineItem));
  });

  it("should update existing line items", async () => {
    const context = new TestContext();
    const project = context.testData.createProject();
    const partner = context.testData.createPartner(project);
    const costCategory = context.testData.createCostCategory();
    const claimDetails = context.testData.createClaimDetail(project, costCategory, partner);
    const claimLineItem = context.testData.createClaimLineItem({ costCategory, partner, periodId: claimDetails.Acc_ProjectPeriodNumber__c, persist: false});
    const lineItem = mapClaimLineItem()(claimLineItem as Repositories.ISalesforceClaimLineItem);

    const dto: ClaimDetailsDto = {
      lineItems: [lineItem]
    } as ClaimDetailsDto;

    expect(context.repositories.claimLineItems.Items).toHaveLength(0);

    const command = new SaveClaimDetails(project.Id, partner.Id, claimDetails.Acc_ProjectPeriodNumber__c, costCategory.Id, dto);
    await context.runCommand(command);

    expect(context.repositories.claimLineItems.Items).toHaveLength(1);
    expect(context.repositories.claimLineItems.Items[0]).toEqual(expect.objectContaining(claimLineItem));
    const id = context.repositories.claimLineItems.Items[0].Id;

    const update: ClaimDetailsDto = {
      ...dto,
      lineItems: [{
        ...lineItem,
        id,
        description: "new description!",
        value: 1234
      }]
    };

    const command2 = new SaveClaimDetails(project.Id, partner.Id, claimDetails.Acc_ProjectPeriodNumber__c, costCategory.Id, update);
    await context.runCommand(command2);

    expect(context.repositories.claimLineItems.Items).toHaveLength(1);
    expect(context.repositories.claimLineItems.Items[0]).toEqual({
      ...claimLineItem,
      Id: id,
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
    const claimDetail = context.testData.createClaimDetail(project, costCategory, partner, periodId);
    const claimLineItem1 = context.testData.createClaimLineItem({periodId, partner, costCategory, persist: false});
    const claimLineItem2 = context.testData.createClaimLineItem({periodId, partner, costCategory, persist: false });

    const lineItem1 = mapClaimLineItem()(claimLineItem1 as Repositories.ISalesforceClaimLineItem);
    const lineItem2 = mapClaimLineItem()(claimLineItem2 as Repositories.ISalesforceClaimLineItem);

    const dto: ClaimDetailsDto = {
      id: claimDetail.Id,
      lineItems: [lineItem1, lineItem2]
    } as ClaimDetailsDto;

    expect(context.repositories.claimLineItems.Items).toHaveLength(0);

    const command = new SaveClaimDetails(project.Id, partner.Id, periodId, costCategory.Id, dto);
    await context.runCommand(command);

    expect(context.repositories.claimLineItems.Items).toHaveLength(2);
    expect(context.repositories.claimLineItems.Items[0]).toEqual(expect.objectContaining(claimLineItem1));
    expect(context.repositories.claimLineItems.Items[1]).toEqual(expect.objectContaining(claimLineItem2));

    const id1 = context.repositories.claimLineItems.Items[0].Id;
    const update = {
      ...dto,
      lineItems: [{
        ...lineItem1,
        id: id1
      }]
    };

    const command2 = new SaveClaimDetails(project.Id, partner.Id, periodId, costCategory.Id, update);
    await context.runCommand(command2);
    expect(context.repositories.claimLineItems.Items).toHaveLength(1);
    expect(context.repositories.claimLineItems.Items[0]).toEqual({
      ...claimLineItem1,
      Id: id1
    });
  });

  test("expect comments to be updated", async () => {
    const context = new TestContext();
    const project = context.testData.createProject();
    const partner = context.testData.createPartner();
    const costCategory = context.testData.createCostCategory();
    const claimDetail = context.testData.createClaimDetail(project, costCategory, partner, 1, x => x.Acc_ReasonForDifference__c = "An old message" );
    const claimDetails = mapClaimDetails(claimDetail, [], context);
    claimDetails.comments = "A new message";

    const command = new SaveClaimDetails(project.Id, partner.Id, 1, costCategory.Id, claimDetails);
    await context.runCommand(command);

    expect(claimDetail.Acc_ReasonForDifference__c).toBe("A new message");
  });

  test("expect comments to be null", async () => {
    const context = new TestContext();
    const project = context.testData.createProject();
    const partner = context.testData.createPartner();
    const costCategory = context.testData.createCostCategory();
    const claimDetail = context.testData.createClaimDetail(project, costCategory, partner, undefined, x => x.Acc_ReasonForDifference__c = "An old message" );
    const claimDetails = mapClaimDetails(claimDetail, [], context);
    claimDetails.comments = null;

    const command = new SaveClaimDetails(project.Id, partner.Id, 1, costCategory.Id, claimDetails);
    await context.runCommand(command);

    expect(claimDetail.Acc_ReasonForDifference__c).toBe(null);
  });

  describe("validateRequest", () => {
    test("invalid project id throws error", async () => {
      const context = new TestContext();
      const project = context.testData.createProject();
      const partner = context.testData.createPartner();
      const costCategory = context.testData.createCostCategory();
      const claimDetail = context.testData.createClaimDetail(project, costCategory, partner, 1);
      const claimDetails = mapClaimDetails(claimDetail, [], context);

      const command = new SaveClaimDetails(null as any, partner.Id, 1, costCategory.Id, claimDetails);
      await expect(context.runCommand(command)).rejects.toThrow(BadRequestError);
    });

    test("invalid partner id throws error", async () => {
      const context = new TestContext();
      const project = context.testData.createProject();
      const partner = context.testData.createPartner();
      const costCategory = context.testData.createCostCategory();
      const claimDetail = context.testData.createClaimDetail(project, costCategory, partner, 1);
      const claimDetails = mapClaimDetails(claimDetail, [], context);

      const command = new SaveClaimDetails(project.Id, null as any, 1, costCategory.Id, claimDetails);
      await expect(context.runCommand(command)).rejects.toThrow(BadRequestError);
    });

    test("invalid periodId throws error", async () => {
      const context = new TestContext();
      const project = context.testData.createProject();
      const partner = context.testData.createPartner();
      const costCategory = context.testData.createCostCategory();
      const claimDetail = context.testData.createClaimDetail(project, costCategory, partner, 1);
      const claimDetails = mapClaimDetails(claimDetail, [], context);

      const command = new SaveClaimDetails(project.Id, partner.Id, null as any, costCategory.Id, claimDetails);
      await expect(context.runCommand(command)).rejects.toThrow(BadRequestError);
    });

    test("invalid costCategory id throws error", async () => {
      const context = new TestContext();
      const project = context.testData.createProject();
      const partner = context.testData.createPartner();
      const costCategory = context.testData.createCostCategory();
      const claimDetail = context.testData.createClaimDetail(project, costCategory, partner, 1);
      const claimDetails = mapClaimDetails(claimDetail, [], context);

      const command = new SaveClaimDetails(project.Id, partner.Id, 1, null as any, claimDetails);
      await expect(context.runCommand(command)).rejects.toThrow(BadRequestError);
    });

    test("lineItems mismatched periodId throws error", async () => {
      const context = new TestContext();
      const project = context.testData.createProject();
      const partner = context.testData.createPartner();
      const costCategory = context.testData.createCostCategory();
      const claimDetail = context.testData.createClaimDetail(project, costCategory, partner, 1);
      const lineItem = { periodId: 2 } as any;
      const claimDetails = mapClaimDetails(claimDetail, [lineItem], context);

      const command = new SaveClaimDetails(project.Id, partner.Id, 1, costCategory.Id, claimDetails);
      await expect(context.runCommand(command)).rejects.toThrow(BadRequestError);
    });

    test("lineItems mismatched partner Id throws error", async () => {
      const context = new TestContext();
      const project = context.testData.createProject();
      const partner = context.testData.createPartner();
      const costCategory = context.testData.createCostCategory();
      const claimDetail = context.testData.createClaimDetail(project, costCategory, partner, 1);
      const lineItem = { partnerId: "invalid" } as any;
      const claimDetails = mapClaimDetails(claimDetail, [lineItem], context);

      const command = new SaveClaimDetails(project.Id, partner.Id, 1, costCategory.Id, claimDetails);
      await expect(context.runCommand(command)).rejects.toThrow(BadRequestError);
    });

    test("lineItems mismatched costCategory Id throws error", async () => {
      const context = new TestContext();
      const project = context.testData.createProject();
      const partner = context.testData.createPartner();
      const costCategory = context.testData.createCostCategory();
      const claimDetail = context.testData.createClaimDetail(project, costCategory, partner, 1);
      const lineItem = { costCategoryId: "invalid" } as any;
      const claimDetails = mapClaimDetails(claimDetail, [lineItem], context);

      const command = new SaveClaimDetails(project.Id, partner.Id, 1, costCategory.Id, claimDetails);
      await expect(context.runCommand(command)).rejects.toThrow(BadRequestError);
    });

  });

  describe("accessControl", () => {
    test("accessControl - Partner Finance contact passes", async () => {
      const context = new TestContext();
      const project = context.testData.createProject();
      const partner = context.testData.createPartner();
      const command = new SaveClaimDetails(project.Id, partner.Id, 1, "", {} as ClaimDetailsDto);
      const auth    = new Authorisation({
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
      const command = new SaveClaimDetails(project.Id, partner.Id, 1, "",  {} as ClaimDetailsDto);
      const auth    = new Authorisation({
        [project.Id]: {
          projectRoles: ProjectRole.FinancialContact | ProjectRole.MonitoringOfficer | ProjectRole.ProjectManager,
          partnerRoles: { [partner.Id]: ProjectRole.MonitoringOfficer | ProjectRole.ProjectManager }
        }
      });

      expect(await context.runAccessControl(auth, command)).toBe(false);
    });
  });
});
