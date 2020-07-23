import { TestContext } from "../../testContextProvider";
import { UpdatePartnerCommand } from "../../../../src/server/features/partners/updatePartnerCommand";
import { PartnerDto, PartnerStatus } from "@framework/dtos";
import { GetByIdQuery } from "@server/features/partners";
import { ValidationError } from "@server/features/common";

describe("updatePartnerCommand", () => {
  it("correctly updates the partner's postcode when the command is run", async () => {
    const context = new TestContext();
    const project = context.testData.createProject();
    const partner = context.testData.createPartner(project);

    const expected: PartnerDto = await context.runQuery(new GetByIdQuery(partner.id));
    expected.postcode = "";
    expected.partnerStatus = PartnerStatus.Pending;

    const command = new UpdatePartnerCommand(expected);
    await expect(context.runCommand(command)).resolves;

    expected.partnerStatus = PartnerStatus.Active;
    await expect(context.runCommand(command)).rejects.toThrow(ValidationError);

    expected.postcode = "BS1 1UU";

    await context.runCommand(command);

    const result = await context.runQuery(new GetByIdQuery(partner.id));
    expect(result).not.toBe(null);
    expect(result.postcode).toEqual(expected.postcode);
  });

  // TODO: this test is only a dummy until we have the SF fields for bank details
  it("correctly updates the partner's bank detail when the command is run", async () => {
    const context = new TestContext();
    const project = context.testData.createProject();
    const partner = context.testData.createPartner(project);

    const expected: PartnerDto = await context.runQuery(new GetByIdQuery(partner.id));
    expected.companyNumber = "123454321";
    expected.sortCode = "001122";
    expected.accountNumber = "12344321";
    expected.firstName = "First";
    expected.lastName = "Name";
    expected.accountBuildingAndStreet = "A Building on B Street";
    expected.accountTownOrCity = "Town-City";
    expected.accountPostcode = "P05T C0D3";

    const commandWithoutVaiidateBankDetails = await context.runCommand(new UpdatePartnerCommand(expected));
    expect(commandWithoutVaiidateBankDetails).toBe(true);
  });

  it("should correctly validate sort code", async () => {
    const context = new TestContext();
    const project = context.testData.createProject();
    const partner = context.testData.createPartner(project);

    const expected: PartnerDto = await context.runQuery(new GetByIdQuery(partner.id));
    expected.sortCode = "00112";

    const command = new UpdatePartnerCommand(expected, true);
    await expect(context.runCommand(command)).rejects.toThrow(ValidationError);

    expected.sortCode = "00112G";
    await expect(context.runCommand(command)).rejects.toThrow(ValidationError);

    // TODO: add pasing case once SF fiedls are mapped
  });

  it("should correctly validate account number", async () => {
    const context = new TestContext();
    const project = context.testData.createProject();
    const partner = context.testData.createPartner(project);

    const expected: PartnerDto = await context.runQuery(new GetByIdQuery(partner.id));
    expected.accountNumber = "12345";

    const command = new UpdatePartnerCommand(expected, true);
    await expect(context.runCommand(command)).rejects.toThrow(ValidationError);

    expected.accountNumber = "123456789";
    await expect(context.runCommand(command)).rejects.toThrow(ValidationError);

    expected.accountNumber = "1234567G";
    await expect(context.runCommand(command)).rejects.toThrow(ValidationError);

    // TODO: add pasing case once SF fiedls are mapped
  });
});
