import { PartnerDto } from "@framework/dtos/partnerDto";
import { getLeadPartner, sortPartnersLeadFirst } from "@framework/util/partnerHelper";

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

  describe("sortPartnersLeadFirst", () => {
    const partners = [
      { id: 0, isLead: false },
      { id: 1, isLead: true },
      { id: 2, isLead: false },
    ];

    it("should sort partners with lead partners at the head of the array", () => {
      expect(sortPartnersLeadFirst(partners)).toEqual([
        { id: 1, isLead: true },
        { id: 0, isLead: false },
        { id: 2, isLead: false },
      ]);
    });
  });
});
