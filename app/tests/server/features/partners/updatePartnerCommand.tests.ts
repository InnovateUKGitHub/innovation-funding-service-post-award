import { TestContext } from "../../testContextProvider";
import { UpdatePartnerCommand } from "../../../../src/server/features/partners/updatePartnerCommand";
import { SalesforceProjectRole } from "@server/repositories";
import { PartnerClaimStatus, PartnerDto, PartnerStatus, ProjectRole } from "@framework/dtos";
import { GetByIdQuery } from "@server/features/partners";

describe("updatePartnerCommand", () => {
  it("correctly updates the partner's postcode when the command is run", async () => {
    const context = new TestContext();

    const project = context.testData.createProject();

    const partner = context.testData.createPartner(project);

    const expected: PartnerDto =await context.runQuery(new GetByIdQuery(partner.Id));

    expected.postcode = "BS2 2SS";

    const command = await context.runCommand(new UpdatePartnerCommand(expected));

    expect(command).toBe(true);

    const result = await context.runQuery(new GetByIdQuery(partner.Id));

    expect(result).not.toBe(null);

    expect(result.postcode).toEqual(expected.postcode);
  });
});
