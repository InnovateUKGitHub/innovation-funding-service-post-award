import { TestContext } from "../../testContextProvider";
import { UpdatePartnerCommand } from "../../../../src/server/features/partners/updatePartnerCommand";
import { BankDetailsTaskStatus, PartnerDto, PartnerStatus, SpendProfileStatus } from "@framework/dtos";
import { GetByIdQuery } from "@server/features/partners";
import { BadRequestError, ValidationError } from "@server/features/common";

describe("updatePartnerCommand", () => {
  // TODO validation failed
  // TODO validation passed
  // TODO update partner bank details after validation
  // TODO verification passed
  // TODO verification failed
  it("correctly updates the partner's postcode when the command is run", async () => {
    const context = new TestContext();
    const project = context.testData.createProject();
    const partner = context.testData.createPartner(project, item => {
      item.postcode = null as any;
      item.participantStatus = "Pending";
      item.bankDetailsTaskStatus = "Complete";
      item.spendProfileStatus = "Complete";
    });

    const expected: PartnerDto = await context.runQuery(new GetByIdQuery(partner.id));

    const command = new UpdatePartnerCommand(expected);
    await expect(context.runCommand(command)).resolves.toBe(true);

    expected.partnerStatus = PartnerStatus.Active;
    await expect(context.runCommand(command)).rejects.toThrow(ValidationError);

    expected.postcode = "BS1 1UU";

    await context.runCommand(command);

    const result = await context.runQuery(new GetByIdQuery(partner.id));
    expect(result).not.toBe(null);
    expect(result.postcode).toEqual(expected.postcode);
  });

  it("Will not validate bank details for an active partner", async () => {
    const context = new TestContext();
    const project = context.testData.createProject();
    const partner = context.testData.createPartner(project, item => {
      item.participantStatus = "Active";
      item.bankDetailsTaskStatus = "Complete";
      item.spendProfileStatus = "Complete";
    });

    const expected: PartnerDto = await context.runQuery(new GetByIdQuery(partner.id));

    const command = new UpdatePartnerCommand(expected, true);
    await expect(context.runCommand(command)).rejects.toThrow(BadRequestError);
  });

  it("Will not allow a partner to become active if the bank checks and initial spend profile arte not complete", async () => {
    const context = new TestContext();
    const project = context.testData.createProject();
    // tslint:disable-next-line:no-identical-functions
    const partner = context.testData.createPartner(project, item => {
      item.participantStatus = "Pending";
      item.bankDetailsTaskStatus = "To do";
      item.spendProfileStatus = "To do";
    });

    const expected: PartnerDto = await context.runQuery(new GetByIdQuery(partner.id));
    expected.partnerStatus = PartnerStatus.Active;
    const command = new UpdatePartnerCommand(expected, true);
    await expect(context.runCommand(command)).rejects.toThrow(ValidationError);

    expected.bankDetailsTaskStatus = BankDetailsTaskStatus.Complete;
    expected.spendProfileStatus = SpendProfileStatus.Complete;

    // TODO put back in once SF fields are available
    // await expect(context.runCommand(command)).resolves.toBe(true);
  });

  // TODO: this test is only a dummy until we have the SF fields for bank details
  it("correctly updates the partner's bank detail when the command is run", async () => {
    const context = new TestContext();
    const project = context.testData.createProject();
    const partner = context.testData.createPartner(project);

    const expected: PartnerDto = await context.runQuery(new GetByIdQuery(partner.id));
    expected.bankDetails.companyNumber = "123454321";
    expected.bankDetails.sortCode = "001122";
    expected.bankDetails.accountNumber = "12344321";
    expected.bankDetails.firstName = "First";
    expected.bankDetails.lastName = "Name";
    expected.bankDetails.address.accountStreet = "A Building on B Street";
    expected.bankDetails.address.accountTownOrCity = "Town-City";
    expected.bankDetails.address.accountPostcode = "P05T C0D3";

    const commandWithoutVaiidateBankDetails = await context.runCommand(new UpdatePartnerCommand(expected));
    expect(commandWithoutVaiidateBankDetails).toBe(true);
  });

  it("should correctly validate sort code", async () => {
    const context = new TestContext();
    const project = context.testData.createProject();
    const partner = context.testData.createPartner(project, item => {
      item.participantStatus = "Pending";
    });

    const expected: PartnerDto = await context.runQuery(new GetByIdQuery(partner.id));
    expected.bankDetails.sortCode = "00112";

    const command = new UpdatePartnerCommand(expected, true);
    await expect(context.runCommand(command)).rejects.toThrow(ValidationError);

    expected.bankDetails.sortCode = "00112G";
    await expect(context.runCommand(command)).rejects.toThrow(ValidationError);

    // TODO: add pasing case once SF fiedls are mapped
  });

  it("should correctly validate account number", async () => {
    const context = new TestContext();
    const project = context.testData.createProject();
    const partner = context.testData.createPartner(project, item => {
      item.participantStatus = "Pending";
    });

    const expected: PartnerDto = await context.runQuery(new GetByIdQuery(partner.id));
    expected.bankDetails.accountNumber = "12345";

    const command = new UpdatePartnerCommand(expected, true);
    await expect(context.runCommand(command)).rejects.toThrow(ValidationError);

    expected.bankDetails.accountNumber = "123456789";
    await expect(context.runCommand(command)).rejects.toThrow(ValidationError);

    expected.bankDetails.accountNumber = "1234567G";
    await expect(context.runCommand(command)).rejects.toThrow(ValidationError);

    // TODO: add pasing case once SF fiedls are mapped
  });
});
