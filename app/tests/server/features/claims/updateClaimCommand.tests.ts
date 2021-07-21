import { UpdateClaimCommand } from "@server/features/claims/updateClaim";
import mapClaim from "@server/features/claims/mapClaim";
import { ClaimStatus } from "@framework/constants";
import { ValidationError } from "@server/features/common/appError";
import { Authorisation, ProjectRole } from "@framework/types";
import { TestContext } from "../../testContextProvider";

describe("UpdateClaimCommand", () => {
  describe("with accessControl", () => {
    test("with project MO passes", async () => {
      const context = new TestContext();
      const project = context.testData.createProject();
      const command = new UpdateClaimCommand(project.Id, {} as any);
      const auth = new Authorisation({
        [project.Id]: {
          projectRoles: ProjectRole.MonitoringOfficer,
          partnerRoles: {},
        },
      });

      expect(await context.runAccessControl(auth, command)).toBe(true);
    });

    test("with partner FC passes", async () => {
      const context = new TestContext();
      const project = context.testData.createProject();
      const claimDto = { partnerId: "abc" };
      const command = new UpdateClaimCommand(project.Id, claimDto as any);
      const auth = new Authorisation({
        [project.Id]: {
          projectRoles: ProjectRole.Unknown,
          partnerRoles: { [claimDto.partnerId]: ProjectRole.FinancialContact },
        },
      });

      expect(await context.runAccessControl(auth, command)).toBe(true);
    });

    test("with other roles should fail", async () => {
      const context = new TestContext();
      const project = context.testData.createProject();
      const claimDto = { partnerId: "abc" };
      const command = new UpdateClaimCommand(project.Id, claimDto as any);
      const auth = new Authorisation({
        [project.Id]: {
          projectRoles: ProjectRole.FinancialContact | ProjectRole.ProjectManager,
          partnerRoles: { [claimDto.partnerId]: ProjectRole.MonitoringOfficer | ProjectRole.ProjectManager },
        },
      });

      expect(await context.runAccessControl(auth, command)).toBe(false);
    });
  });

  it("when claim id not set expect validation exception", async () => {
    const context = new TestContext();
    const dto = mapClaim(context)(context.testData.createClaim());
    dto.id = null!;
    const project = context.testData.createProject();
    const command = new UpdateClaimCommand(project.Id, dto);
    await expect(context.runCommand(command)).rejects.toThrow(ValidationError);
  });

  it("when status updated to draft expect item updated", async () => {
    const context = new TestContext();
    const claim = context.testData.createClaim(undefined, undefined, x => (x.Acc_ClaimStatus__c = "New" as any));
    const dto = mapClaim(context)(claim);
    const project = context.testData.createProject();

    dto.status = ClaimStatus.DRAFT;

    const command = new UpdateClaimCommand(project.Id, dto);
    await context.runCommand(command);

    expect(claim.Acc_ClaimStatus__c).toBe(ClaimStatus.DRAFT);
  });

  it("when status updated to submitted expect item updated", async () => {
    const context = new TestContext();
    const claim = context.testData.createClaim(undefined, undefined, x => (x.Acc_ClaimStatus__c = ClaimStatus.DRAFT));
    const dto = mapClaim(context)(claim);
    const project = context.testData.createProject();

    dto.status = ClaimStatus.SUBMITTED;

    const command = new UpdateClaimCommand(project.Id, dto);
    await context.runCommand(command);

    expect(claim.Acc_ClaimStatus__c).toBe(ClaimStatus.SUBMITTED);
  });

  it("updates the status to submitted if an iar is required and there are claim documents uploaded", async () => {
    const context = new TestContext();
    const claim = context.testData.createClaim(undefined, undefined, x => {
      x.Acc_ClaimStatus__c = ClaimStatus.DRAFT;
      x.Acc_IARRequired__c = true;
    });
    context.testData.createDocument(claim.Id, "cats_are_the_best.txt");
    const dto = mapClaim(context)(claim);
    const project = context.testData.createProject();

    dto.status = ClaimStatus.SUBMITTED;

    const command = new UpdateClaimCommand(project.Id, dto);
    await context.runCommand(command);

    expect(claim.Acc_ClaimStatus__c).toBe(ClaimStatus.SUBMITTED);
  });

  it("when status updated to approved expect item updated", async () => {
    const context = new TestContext();
    const claim = context.testData.createClaim(undefined, undefined, x => (x.Acc_ClaimStatus__c = ClaimStatus.DRAFT));
    const dto = mapClaim(context)(claim);
    const project = context.testData.createProject();

    dto.status = ClaimStatus.AWAITING_IUK_APPROVAL;

    const command = new UpdateClaimCommand(project.Id, dto);
    await context.runCommand(command);

    expect(claim.Acc_ClaimStatus__c).toBe(ClaimStatus.AWAITING_IUK_APPROVAL);
  });

  it("when status updated to queried expect item updated", async () => {
    const context = new TestContext();
    const claim = context.testData.createClaim(undefined, undefined, x => (x.Acc_ClaimStatus__c = ClaimStatus.DRAFT));
    const dto = mapClaim(context)(claim);
    const project = context.testData.createProject();

    dto.status = ClaimStatus.MO_QUERIED;
    dto.comments = "Test comments";

    const command = new UpdateClaimCommand(project.Id, dto);
    await context.runCommand(command);

    expect(claim.Acc_ClaimStatus__c).toBe(ClaimStatus.MO_QUERIED);
  });

  it("when status updated to something other than draft or submitted expect error", async () => {
    const context = new TestContext();
    const claim = context.testData.createClaim(undefined, undefined, x => (x.Acc_ClaimStatus__c = ClaimStatus.DRAFT));
    const dto = mapClaim(context)(claim);
    const project = context.testData.createProject();

    dto.status = ClaimStatus.PAID;

    const command = new UpdateClaimCommand(project.Id, dto);
    await expect(context.runCommand(command)).rejects.toThrow(ValidationError);
  });

  it("can update when status is Innovate Queried", async () => {
    const context = new TestContext();
    const claim = context.testData.createClaim(
      undefined,
      undefined,
      x => (x.Acc_ClaimStatus__c = ClaimStatus.INNOVATE_QUERIED),
    );
    const dto = mapClaim(context)(claim);
    const project = context.testData.createProject();
    const command = new UpdateClaimCommand(project.Id, dto);
    await context.runCommand(command);

    expect(claim.Acc_ClaimStatus__c).toBe(ClaimStatus.INNOVATE_QUERIED);
  });

  it("when message updated expect item updated", async () => {
    const context = new TestContext();
    const claim = context.testData.createClaim(
      undefined,
      undefined,
      x => (x.Acc_ReasonForDifference__c = "Original Message"),
    );
    const dto = mapClaim(context)(claim);
    const project = context.testData.createProject();

    dto.comments = "A New Message";

    const command = new UpdateClaimCommand(project.Id, dto);
    await context.runCommand(command);

    expect(claim.Acc_ReasonForDifference__c).toBe("A New Message");
  });

  it("when message is over 1000 characters expect expection", async () => {
    const context = new TestContext();
    const claim = context.testData.createClaim();
    const dto = mapClaim(context)(claim);
    const project = context.testData.createProject();

    dto.comments = "a".repeat(1001);

    const command = new UpdateClaimCommand(project.Id, dto);
    await expect(context.runCommand(command)).rejects.toThrow(ValidationError);
  });

  it("when message is 1000 characters expect no exception", async () => {
    const context = new TestContext();
    const claim = context.testData.createClaim();
    const dto = mapClaim(context)(claim);
    const project = context.testData.createProject();

    dto.comments = "a".repeat(1000);

    const command = new UpdateClaimCommand(project.Id, dto);
    await context.runCommand(command);
  });

  it("when message is not set and claim status is changing to MO Quried expect validation excetion", async () => {
    const context = new TestContext();
    const partner = context.testData.createPartner();
    const claim = context.testData.createClaim(partner);

    const dto = mapClaim(context)(claim);
    dto.status = ClaimStatus.MO_QUERIED;
    dto.comments = "";

    await expect(context.runCommand(new UpdateClaimCommand(partner.projectId, dto))).rejects.toThrow(ValidationError);

    dto.comments = "Some comments";

    await expect(context.runCommand(new UpdateClaimCommand(partner.projectId, dto))).resolves.toEqual(true);
  });

  it("when message is not set and claim status is already MO Quried expect no validation excetion", async () => {
    const context = new TestContext();
    const partner = context.testData.createPartner();
    const claim = context.testData.createClaim(partner);
    claim.Acc_ClaimStatus__c = ClaimStatus.MO_QUERIED;

    const dto = mapClaim(context)(claim);
    dto.status = ClaimStatus.MO_QUERIED;
    dto.comments = "";

    await expect(context.runCommand(new UpdateClaimCommand(partner.projectId, dto))).resolves.toEqual(true);
  });

  it("when claim is over limits for any cost category expect exception", async () => {
    const context = new TestContext();
    const testData = context.testData;
    const project = testData.createProject();
    const partner = testData.createPartner();
    const claim = testData.createClaim(partner, 2);
    const costCategory = testData.createCostCategory();

    testData.createClaimDetail(project, costCategory, partner, 1, x => {
      x.Acc_PeriodCostCategoryTotal__c = 1000000;
    });
    testData.createClaimDetail(project, costCategory, partner, 2, x => {
      x.Acc_PeriodCostCategoryTotal__c = 1000000;
    });

    const dto = mapClaim(context)(claim);
    const command = new UpdateClaimCommand(project.Id, dto);
    await expect(context.runCommand(command)).rejects.toThrow(ValidationError);
  });

  it("when status has changed expect status change record created", async () => {
    const context = new TestContext();
    const project = context.testData.createProject();
    const partner = context.testData.createPartner();
    const claim = context.testData.createClaim(partner, 2);
    claim.Acc_ClaimStatus__c = ClaimStatus.DRAFT;

    const dto = mapClaim(context)(claim);

    dto.status = ClaimStatus.SUBMITTED;

    const command = new UpdateClaimCommand(project.Id, dto);

    expect(context.repositories.claimStatusChanges.Items.length).toBe(0);

    await context.runCommand(command);

    expect(context.repositories.claimStatusChanges.Items.length).toBe(1);

    const statusChange = context.repositories.claimStatusChanges.Items[0];

    expect(statusChange.Acc_Claim__c).toEqual(claim.Id);
  });

  it("when status has not changed expect no status change record", async () => {
    const context = new TestContext();
    const project = context.testData.createProject();
    const partner = context.testData.createPartner();
    const claim = context.testData.createClaim(partner, 2);
    claim.Acc_ClaimStatus__c = ClaimStatus.SUBMITTED;

    const dto = mapClaim(context)(claim);

    const command = new UpdateClaimCommand(project.Id, dto);

    await context.runCommand(command);

    expect(context.repositories.claimStatusChanges.Items.length).toBe(0);
  });

  it("when status has changed expect comments to be stored in status change record", async () => {
    const context = new TestContext();
    const project = context.testData.createProject();
    const partner = context.testData.createPartner();
    const claim = context.testData.createClaim(partner, 2);
    claim.Acc_ClaimStatus__c = ClaimStatus.SUBMITTED;
    claim.Acc_ReasonForDifference__c = "Orignal Comments";

    const dto = mapClaim(context)(claim);

    dto.status = ClaimStatus.MO_QUERIED;

    const command = new UpdateClaimCommand(project.Id, dto);

    await context.runCommand(command);

    expect(context.repositories.claimStatusChanges.Items.length).toBe(1);
    expect(context.repositories.claimStatusChanges.Items[0].Acc_ExternalComment__c).toBe("Orignal Comments");
    expect(claim.Acc_ReasonForDifference__c).toBe("");
  });

  test("when status has changed to AWAITING_IUK_APPROVAL expect comment to not be external", async () => {
    const context = new TestContext();
    const project = context.testData.createProject();
    const partner = context.testData.createPartner();
    const claim = context.testData.createClaim(partner, 2);

    claim.Acc_ClaimStatus__c = ClaimStatus.SUBMITTED;

    const dto = mapClaim(context)(claim);

    dto.status = ClaimStatus.AWAITING_IUK_APPROVAL;

    const command = new UpdateClaimCommand(project.Id, dto);

    await context.runCommand(command);

    expect(context.repositories.claimStatusChanges.Items.length).toBe(1);
    expect(context.repositories.claimStatusChanges.Items[0].Acc_ParticipantVisibility__c).toBe(false);
  });

  test("when status has changed from INNOVATE_QUERIED to AWAITING_IUK_APPROVAL expect comment to be external", async () => {
    const context = new TestContext();
    const project = context.testData.createProject();
    const partner = context.testData.createPartner();
    const claim = context.testData.createClaim(partner, 2);

    claim.Acc_ClaimStatus__c = ClaimStatus.INNOVATE_QUERIED;

    const dto = mapClaim(context)(claim);

    dto.status = ClaimStatus.AWAITING_IUK_APPROVAL;

    const command = new UpdateClaimCommand(project.Id, dto);

    await context.runCommand(command);

    expect(context.repositories.claimStatusChanges.Items.length).toBe(1);
    expect(context.repositories.claimStatusChanges.Items[0].Acc_ParticipantVisibility__c).toBe(true);
  });

  it("when status has changed to MO_QUERIED expect comment to be external", async () => {
    const context = new TestContext();
    const project = context.testData.createProject();
    const partner = context.testData.createPartner();
    const claim = context.testData.createClaim(partner, 2);

    claim.Acc_ClaimStatus__c = ClaimStatus.SUBMITTED;

    const dto = mapClaim(context)(claim);

    dto.status = ClaimStatus.MO_QUERIED;
    dto.comments = "Claim Queried";

    const command = new UpdateClaimCommand(project.Id, dto);

    await context.runCommand(command);

    expect(context.repositories.claimStatusChanges.Items.length).toBe(1);
    expect(context.repositories.claimStatusChanges.Items[0].Acc_ParticipantVisibility__c).toBe(true);
  });

  describe("when iar required", () => {
    const isClaimSummaryTrue = true;
    const isIarRequiredState = true;

    describe("with valid submission", () => {
      it("with an invalid competitionType", async () => {
        const invalidCompetitionType = "CR&D";

        const context = new TestContext();
        const project = context.testData.createProject();
        const partner = context.testData.createPartner(project, x => (x.competitionType = invalidCompetitionType));
        const claim = context.testData.createClaim(partner, undefined, x => {
          x.Acc_ClaimStatus__c = ClaimStatus.SUBMITTED;
          x.Acc_IARRequired__c = isIarRequiredState;
          x.Acc_IAR_Status__c = "Received";
        });
        const dto = mapClaim(context)(claim);

        const command = new UpdateClaimCommand(project.Id, dto);
        await expect(context.runCommand(command)).resolves.toEqual(true);
      });

      it("with iar required is false", async () => {
        const iarRequiredIsFalse = false;

        const context = new TestContext();
        const project = context.testData.createProject();
        const partner = context.testData.createPartner(project, x => (x.competitionType = "KTP"));
        const claim = context.testData.createClaim(partner, undefined, x => {
          x.Acc_ClaimStatus__c = ClaimStatus.SUBMITTED;
          x.Acc_IARRequired__c = iarRequiredIsFalse;
          x.Acc_IAR_Status__c = "Received";
        });
        const dto = mapClaim(context)(claim);

        const command = new UpdateClaimCommand(project.Id, dto, isClaimSummaryTrue);
        await expect(context.runCommand(command)).resolves.toEqual(true);
      });

      it("when not a claim summary", async () => {
        const isNotClaimSummary = false;

        const context = new TestContext();
        const project = context.testData.createProject();
        const claim = context.testData.createClaim();

        const dto = mapClaim(context)(claim);

        const command = new UpdateClaimCommand(project.Id, dto, isNotClaimSummary);
        await expect(context.runCommand(command)).resolves.toEqual(true);
      });
    });

    describe("throws a validation error", () => {
      it("when documents are missing from a valid a valid request", async () => {
        const validCompetitionType = "KTP";
        const validIarStatus = "Received";

        const context = new TestContext();
        const project = context.testData.createProject();
        const partner = context.testData.createPartner(project, x => (x.competitionType = validCompetitionType));
        // Note: no testData createDocument() is created!
        const claim = context.testData.createClaim(partner, undefined, x => {
          x.Acc_ClaimStatus__c = ClaimStatus.SUBMITTED;
          x.Acc_IARRequired__c = isIarRequiredState;
          x.Acc_IAR_Status__c = validIarStatus;
        });
        const dto = mapClaim(context)(claim);

        const command = new UpdateClaimCommand(project.Id, dto, isClaimSummaryTrue);
        await expect(context.runCommand(command)).rejects.toThrow(ValidationError);
      });

      it("when iar status is invalid but the request with documents is valid", async () => {
        const validCompetitionType = "KTP";
        const invalidIarStatus = "Not Received";

        const context = new TestContext();
        const project = context.testData.createProject();
        const partner = context.testData.createPartner(project, x => (x.competitionType = validCompetitionType));
        const claim = context.testData.createClaim(partner, undefined, x => {
          x.Acc_ClaimStatus__c = ClaimStatus.SUBMITTED;
          x.Acc_IARRequired__c = isIarRequiredState;
          x.Acc_IAR_Status__c = invalidIarStatus;
        });
        context.testData.createDocument(claim.Id, "stub-document.docx");
        const dto = mapClaim(context)(claim);

        const command = new UpdateClaimCommand(project.Id, dto, isClaimSummaryTrue);
        await expect(context.runCommand(command)).rejects.toThrow(ValidationError);
      });
    });
  });

  describe("with validateFinalClaim", () => {
    describe("when isClaimSummary is false", () => {
      const isNotClaimSummary = false;

      it("should pass validation when command is not on summary", async () => {
        const context = new TestContext();
        const project = context.testData.createProject();
        const claim = context.testData.createClaim();

        const dto = mapClaim(context)(claim);

        const command = new UpdateClaimCommand(project.Id, dto, isNotClaimSummary);

        await expect(context.runCommand(command)).resolves.toEqual(true);
      });

      it("should pass validation when competitionType is KTP", async () => {
        const validCompetitionType = "KTP";

        const context = new TestContext();
        const project = context.testData.createProject();
        context.testData.createPartner(project, x => (x.competitionType = validCompetitionType));
        const claim = context.testData.createClaim();

        const dto = mapClaim(context)(claim);

        const command = new UpdateClaimCommand(project.Id, dto, isNotClaimSummary);

        await expect(context.runCommand(command)).resolves.toEqual(true);
      });
    });

    describe("when isClaimSummary is true", () => {
      it("should fail validation with missing documents when not the final claim", async () => {
        const context = new TestContext();
        const project = context.testData.createProject();
        const partner = context.testData.createPartner();
        // Note: no testData createDocument() is created!
        const claim = context.testData.createClaim(partner, 2, x => (x.Acc_FinalClaim__c = false));

        claim.Acc_ClaimStatus__c = ClaimStatus.DRAFT;

        const dto = mapClaim(context)(claim);

        const command = new UpdateClaimCommand(project.Id, dto, true);

        await expect(context.runCommand(command)).rejects.toThrow(ValidationError);
      });

      it("should fail validation when not the final claim and has documents attached", async () => {
        const context = new TestContext();
        const project = context.testData.createProject();
        const partner = context.testData.createPartner();
        const claim = context.testData.createClaim(partner, 2, x => (x.Acc_FinalClaim__c = false));
        context.testData.createDocument(claim.Id, "stub-document.docx");

        claim.Acc_ClaimStatus__c = ClaimStatus.DRAFT;

        const dto = mapClaim(context)(claim);

        const command = new UpdateClaimCommand(project.Id, dto, true);

        await expect(context.runCommand(command)).rejects.toThrow(ValidationError);
      });

      it("should ignore validation when project is KTP", async () => {
        const context = new TestContext();
        const project = context.testData.createProject();
        const partner = context.testData.createPartner(project, x => (x.competitionType = "KTP"));
        const claim = context.testData.createClaim(partner, 2);

        claim.Acc_ClaimStatus__c = ClaimStatus.DRAFT;

        const dto = mapClaim(context)(claim);

        const command = new UpdateClaimCommand(project.Id, dto, true);

        await expect(context.runCommand(command)).resolves.toEqual(true);
      });

      it("should pass validation when PCF status is Received", async () => {
        const context = new TestContext();
        const project = context.testData.createProject();
        const partner = context.testData.createPartner();
        const claim = context.testData.createClaim(partner, 2, x => {
          x.Acc_FinalClaim__c = true;
          x.Acc_PCF_Status__c = "Received";
        });

        claim.Acc_ClaimStatus__c = ClaimStatus.DRAFT;

        const dto = mapClaim(context)(claim);

        const command = new UpdateClaimCommand(project.Id, dto, true);

        await expect(context.runCommand(command)).resolves.toEqual(true);
      });

      it("should pass validation when PCF status is Not Received", async () => {
        const context = new TestContext();
        const project = context.testData.createProject();
        const partner = context.testData.createPartner();
        const claim = context.testData.createClaim(partner, 2, x => {
          x.Acc_FinalClaim__c = true;
          x.Acc_PCF_Status__c = "Not Received";
        });

        claim.Acc_ClaimStatus__c = ClaimStatus.DRAFT;

        const dto = mapClaim(context)(claim);

        const command = new UpdateClaimCommand(project.Id, dto, true);

        await expect(context.runCommand(command)).rejects.toThrow(ValidationError);
      });
    });
  });
});
