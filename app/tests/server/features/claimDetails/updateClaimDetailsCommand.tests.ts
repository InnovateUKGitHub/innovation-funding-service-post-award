import { TestContext } from "../../testContextProvider";
import { Authorisation, ProjectRole } from "@framework/types";
import { UpdateClaimDetailsCommand } from "@server/features/claimDetails/updateClaimDetails";
import { mapClaimDetails } from "@server/features/claimDetails/mapClaimDetails";

describe("UpdateClaimDetailsCommand", () => {
  test("accessControl - Finance Contact passes", async () => {
    const context = new TestContext();
    const project = context.testData.createProject();
    const partner = context.testData.createPartner();
    const claimDetailsDto = { comments: "comments" };
    const command = new UpdateClaimDetailsCommand(project.Id, partner.Id, claimDetailsDto as any);
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
    const claimDetailsDto = { comments: "comments" };
    const command = new UpdateClaimDetailsCommand(project.Id, partner.Id, claimDetailsDto as any);
    const auth = new Authorisation({
      [project.Id]: {
        projectRoles: ProjectRole.MonitoringOfficer | ProjectRole.ProjectManager | ProjectRole.FinancialContact,
        partnerRoles: { [partner.Id]: ProjectRole.MonitoringOfficer | ProjectRole.ProjectManager }
      }
    });

    expect(await context.runAccessControl(auth, command)).toBe(false);
  });

  test("expect comments to be updated", async () => {
    const context = new TestContext();
    const project = context.testData.createProject();
    const partner = context.testData.createPartner();
    const claimDetail = context.testData.createClaimDetail(undefined, undefined, undefined, x => x.Acc_ReasonForDifference__c = "An old message" );
    const dto = mapClaimDetails(claimDetail, context);

    dto.comments = "A new message";

    const command = new UpdateClaimDetailsCommand(project.Id, partner.Id, dto);
    await context.runCommand(command);

    expect(claimDetail.Acc_ReasonForDifference__c).toBe("A new message");
  });

  test("expect comments to be null", async () => {
    const context = new TestContext();
    const project = context.testData.createProject();
    const partner = context.testData.createPartner();
    const claimDetail = context.testData.createClaimDetail(undefined, undefined, undefined, x => x.Acc_ReasonForDifference__c = "An old message" );
    const dto = mapClaimDetails(claimDetail, context);

    dto.comments = null;

    const command = new UpdateClaimDetailsCommand(project.Id, partner.Id, dto);
    await context.runCommand(command);

    expect(claimDetail.Acc_ReasonForDifference__c).toBe(null);
  });
});
