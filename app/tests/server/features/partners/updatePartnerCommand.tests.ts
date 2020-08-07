import { TestContext } from "../../testContextProvider";
import { UpdatePartnerCommand } from "../../../../src/server/features/partners/updatePartnerCommand";
import { BankCheckStatus, BankDetailsTaskStatus, PartnerDto, PartnerStatus, SpendProfileStatus } from "@framework/dtos";
import { GetByIdQuery } from "@server/features/partners";
import { ValidationError } from "@server/features/common";
import { BankCheckStatusMapper, BankDetailsTaskStatusMapper, PartnerSpendProfileStatusMapper, PartnerStatusMapper } from "@server/features/partners/mapToPartnerDto";
import { Partner } from "@framework/entities";

describe("updatePartnerCommand", () => {
  const setup = (updates?: Partial<Partner>) => {
    const context = new TestContext();
    const project = context.testData.createProject();
    const partner = context.testData.createPartner(project, item => {
      item.postcode = null as any;
      item.participantStatus = new PartnerStatusMapper().mapToSalesforce(PartnerStatus.Pending) || "";
      item.spendProfileStatus = new PartnerSpendProfileStatusMapper().mapToSalesforce(SpendProfileStatus.ToDo) || "";
      item.bankDetailsTaskStatus = new BankDetailsTaskStatusMapper().mapToSalesforce(BankDetailsTaskStatus.ToDo) || "";
      item.bankCheckStatus = new BankCheckStatusMapper().mapToSalesforce(BankCheckStatus.NotValidated) || "";
      item.sortCode = "123456";
      item.accountNumber = "12345678";
      item.firstName = "First";
      item.lastName = "Last";
      item.companyNumber = "123";
      item.accountStreet = "Street";
      item.accountLocality = "North";
      item.accountPostcode = "P05T COD3";
      item.accountTownOrCity = "Town";
      item.accountBuilding = "Building";
      Object.assign(item, updates);
    });
    return { context, partner };
  };
  it("correctly updates the partner's postcode when the command is run", async () => {
    const { context, partner } = setup({
      participantStatus: new PartnerStatusMapper().mapToSalesforce(PartnerStatus.Pending) || "",
      spendProfileStatus: new PartnerSpendProfileStatusMapper().mapToSalesforce(SpendProfileStatus.Complete) || "",
      bankDetailsTaskStatus: new BankDetailsTaskStatusMapper().mapToSalesforce(BankDetailsTaskStatus.Complete) || "",
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

  it("updates validation check fields when validation fails", async () => {
    const { context, partner } = setup({
      sortCode: "111111",
    });

    const expected: PartnerDto = await context.runQuery(new GetByIdQuery(partner.id));

    const command = new UpdatePartnerCommand(expected, true);
    await expect(context.runCommand(command)).rejects.toThrow(ValidationError);
    const result = await context.runQuery(new GetByIdQuery(partner.id));
    expect(result.validationResponse.validationConditionsSeverity).toEqual("");
    expect(result.validationResponse.validationConditionsCode).toEqual("");
    expect(result.validationResponse.validationConditionsDesc).toEqual("");

    expected.bankCheckRetryAttempts = 3;

    await expect(context.runCommand(command)).resolves.toBe(true);
    const updatedResult = await context.runQuery(new GetByIdQuery(partner.id));
    expect(updatedResult.bankCheckStatus).toEqual(BankCheckStatus.ValidationFailed);
    expect(updatedResult.validationResponse.validationConditionsSeverity).toEqual("error");
    expect(updatedResult.validationResponse.validationConditionsCode).toEqual("3");
    expect(updatedResult.validationResponse.validationConditionsDesc).toEqual("error description");
  });

  it("should update the partner's validate bank detail when the command is run", async () => {
    const { context, partner } = setup();

    const expected: PartnerDto = await context.runQuery(new GetByIdQuery(partner.id));
    expected.bankDetails.firstName = "New";
    expected.bankDetails.lastName = "Updated";
    expected.bankDetails.companyNumber = "321";
    expected.bankDetails.address.accountBuilding = "Flat 2";
    expected.bankDetails.address.accountLocality = "South";
    expected.bankDetails.address.accountPostcode = "BS1 1AA";
    expected.bankDetails.address.accountStreet = "South Street";
    expected.bankDetails.address.accountTownOrCity = "Bristol";
    expected.bankDetails.sortCode = "654321";
    expected.bankDetails.accountNumber = "87654321";

    const command = new UpdatePartnerCommand(expected, true);
    await expect(context.runCommand(command)).resolves.toBe(true);
    const result = await context.runQuery(new GetByIdQuery(partner.id));
    expect(result.bankCheckStatus).toEqual(BankCheckStatus.ValidationPassed);
    expect(result.bankDetails.accountNumber).toEqual(expected.bankDetails.accountNumber);
    expect(result.bankDetails.companyNumber).toEqual(expected.bankDetails.companyNumber);
    expect(result.bankDetails.firstName).toEqual(expected.bankDetails.firstName);
    expect(result.bankDetails.lastName).toEqual(expected.bankDetails.lastName);
    expect(result.bankDetails.sortCode).toEqual(expected.bankDetails.sortCode);
    expect(result.bankDetails.address.accountBuilding).toEqual(expected.bankDetails.address.accountBuilding);
    expect(result.bankDetails.address.accountLocality).toEqual(expected.bankDetails.address.accountLocality);
    expect(result.bankDetails.address.accountPostcode).toEqual(expected.bankDetails.address.accountPostcode);
    expect(result.bankDetails.address.accountStreet).toEqual(expected.bankDetails.address.accountStreet);
    expect(result.bankDetails.address.accountTownOrCity).toEqual(expected.bankDetails.address.accountTownOrCity);
    expect(result.validationResponse.validationCheckPassed).toEqual(true);
    expect(result.validationResponse.iban).toEqual("123456");
    expect(result.validationResponse.validationConditionsCode).toEqual("2");
    expect(result.validationResponse.validationConditionsDesc).toEqual("description");
    expect(result.validationResponse.validationConditionsSeverity).toEqual("warning");
  });

  it("should allow bank details to be updated after passing validation", async () => {
    const { context, partner } = setup({
      bankCheckStatus: new BankCheckStatusMapper().mapToSalesforce(BankCheckStatus.ValidationPassed) || "",
    });

    const expected: PartnerDto = await context.runQuery(new GetByIdQuery(partner.id));
    expected.bankDetails.firstName = "New";
    expected.bankDetails.lastName = "Updated";
    expected.bankDetails.companyNumber = "321";
    expected.bankDetails.address.accountBuilding = "Flat 2";
    expected.bankDetails.address.accountLocality = "South";
    expected.bankDetails.address.accountPostcode = "BS1 1AA";
    expected.bankDetails.address.accountStreet = "South Street";
    expected.bankDetails.address.accountTownOrCity = "Bristol";
    expected.bankDetails.sortCode = "654321";
    expected.bankDetails.accountNumber = "87654321";

    const command = new UpdatePartnerCommand(expected, true);
    await expect(context.runCommand(command)).resolves.toBe(true);

    const result = await context.runQuery(new GetByIdQuery(partner.id));
    expect(result.bankDetails.companyNumber).toEqual(expected.bankDetails.companyNumber);
    expect(result.bankDetails.firstName).toEqual(expected.bankDetails.firstName);
    expect(result.bankDetails.lastName).toEqual(expected.bankDetails.lastName);
    expect(result.bankDetails.address.accountBuilding).toEqual(expected.bankDetails.address.accountBuilding);
    expect(result.bankDetails.address.accountLocality).toEqual(expected.bankDetails.address.accountLocality);
    expect(result.bankDetails.address.accountPostcode).toEqual(expected.bankDetails.address.accountPostcode);
    expect(result.bankDetails.address.accountStreet).toEqual(expected.bankDetails.address.accountStreet);
    expect(result.bankDetails.address.accountTownOrCity).toEqual(expected.bankDetails.address.accountTownOrCity);
    expect(result.bankDetails.sortCode).toEqual(partner.sortCode);
    expect(result.bankDetails.accountNumber).toEqual(partner.accountNumber);
  });

  it("should update the partner's verify response bank details", async () => {
    const { context, partner } =setup({
      bankCheckStatus: new BankCheckStatusMapper().mapToSalesforce(BankCheckStatus.ValidationPassed) || "",
    });

    const expected: PartnerDto = await context.runQuery(new GetByIdQuery(partner.id));

    const command = new UpdatePartnerCommand(expected, false, true);
    await expect(context.runCommand(command)).resolves.toBe(true);
    const result = await context.runQuery(new GetByIdQuery(partner.id));
    expect(result.bankCheckStatus).toEqual(BankCheckStatus.VerificationPassed);
    expect(result.verificationResponse.addressScore).toEqual(7);
    expect(result.verificationResponse.companyNameScore).toEqual(8);
    expect(result.verificationResponse.personalDetailsScore).toEqual(7);
    expect(result.verificationResponse.regNumberScore).toEqual("Match");
    expect(result.verificationResponse.verificationConditionsCode).toEqual("2");
    expect(result.verificationResponse.verificationConditionsDesc).toEqual("description");
    expect(result.verificationResponse.verificationConditionsSeverity).toEqual("warning");
  });
  it("should update the partner's verify response bank details correctly on unsuccessful verify", async () => {
    const { context, partner } = setup({
      bankCheckStatus: new BankCheckStatusMapper().mapToSalesforce(BankCheckStatus.ValidationPassed) || "",
      sortCode: "111111",
    });

    const expected: PartnerDto = await context.runQuery(new GetByIdQuery(partner.id));

    const command = new UpdatePartnerCommand(expected, false, true);
    await expect(context.runCommand(command)).resolves.toBe(true);
    const result = await context.runQuery(new GetByIdQuery(partner.id));
    expect(result.bankCheckStatus).toEqual(BankCheckStatus.VerificationFailed);
    expect(result.verificationResponse.addressScore).toEqual(0);
    expect(result.verificationResponse.companyNameScore).toEqual(1);
    expect(result.verificationResponse.personalDetailsScore).toEqual(2);
    expect(result.verificationResponse.regNumberScore).toEqual("No Match");
    expect(result.verificationResponse.verificationConditionsCode).toEqual("3");
    expect(result.verificationResponse.verificationConditionsDesc).toEqual("error description");
    expect(result.verificationResponse.verificationConditionsSeverity).toEqual("error");
  });
});
