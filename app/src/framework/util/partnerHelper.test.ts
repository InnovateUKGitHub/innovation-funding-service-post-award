import { PartnerDto } from "@framework/dtos";
import { getLeadPartner } from "@framework/util/partnerHelper";

describe("partnerHelper", () => {
  describe("getLeadPartner()", () => {
    const stubNotLeadPartner = { id: "stub-id", isLead: false } as PartnerDto;

    const stubLeadPartner = { ...stubNotLeadPartner, isLead: true };

    test.each`
      name                                           | inboundPartner                                               | expectedValue
      ${"with no partners"}                          | ${[]}                                                        | ${undefined}
      ${"with no lead partner"}                      | ${[stubNotLeadPartner]}                                      | ${undefined}
      ${"with lead partner with two partners"}       | ${[stubNotLeadPartner, stubLeadPartner]}                     | ${stubLeadPartner}
      ${"with lead partner  with multiple partners"} | ${[stubNotLeadPartner, stubNotLeadPartner, stubLeadPartner]} | ${stubLeadPartner}
    `("$name", ({ inboundPartner, expectedValue }) => {
      const result = getLeadPartner(inboundPartner);

      expect(result).toBe(expectedValue);
    });
  });
});
