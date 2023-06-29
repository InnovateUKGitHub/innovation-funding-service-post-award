import { PartnerNameValues, getPartnerName } from "./partnerName";

describe("getPartnerName()", () => {
  const stubBasePartner: PartnerNameValues = {
    name: "stub-partner-name",
    isWithdrawn: false,
    isLead: false,
  };

  describe("@renders", () => {
    it("as default", () => {
      const partnerName = getPartnerName(stubBasePartner);

      expect(partnerName).toBe(stubBasePartner.name);
    });

    it("with no partner", () => {
      expect(getPartnerName()).toBe("");
    });

    describe("with lead partner", () => {
      const stubLeadPartner: PartnerNameValues = {
        ...stubBasePartner,
        isLead: true,
      };

      describe("when showIsLead is true", () => {
        test.each`
          name                                                   | partnerObject                                 | expectedName
          ${"when showIsLead is true with isWithdrawn is false"} | ${{ ...stubLeadPartner, isWithdrawn: false }} | ${`${stubLeadPartner.name} (Lead)`}
          ${"when showIsLead is true with isWithdrawn is true"}  | ${{ ...stubLeadPartner, isWithdrawn: true }}  | ${`${stubLeadPartner.name} (withdrawn) (Lead)`}
        `("$name", ({ partnerObject, expectedName }) => {
          const partnerName = getPartnerName(partnerObject, true);

          expect(partnerName).toBe(expectedName);
        });
      });

      describe("when showIsLead is false", () => {
        test.each`
          name                                                    | partnerObject                                 | expectedName
          ${"when showIsLead is false with isWithdrawn is false"} | ${{ ...stubLeadPartner, isWithdrawn: false }} | ${stubLeadPartner.name}
          ${"when showIsLead is false with isWithdrawn is true"}  | ${{ ...stubLeadPartner, isWithdrawn: true }}  | ${`${stubLeadPartner.name} (withdrawn)`}
        `("$name", ({ partnerObject, expectedName }) => {
          const partnerName = getPartnerName(partnerObject);

          expect(partnerName).toBe(expectedName);
        });
      });
    });

    describe("with withdrawn partner", () => {
      const stubWithdrawnPartner: PartnerNameValues = {
        ...stubBasePartner,
        isWithdrawn: true,
      };

      describe("when showWidthdrawn is true", () => {
        describe("when showIsLead is true", () => {
          test.each`
            name                                               | partnerObject                                 | expectedName
            ${"when showIsLead is false with isLead is false"} | ${{ ...stubWithdrawnPartner, isLead: false }} | ${`${stubWithdrawnPartner.name} (withdrawn)`}
            ${"when showIsLead is false with isLead is true"}  | ${{ ...stubWithdrawnPartner, isLead: true }}  | ${`${stubWithdrawnPartner.name} (withdrawn) (Lead)`}
          `("$name", ({ partnerObject, expectedName }) => {
            const partnerName = getPartnerName(partnerObject, true);

            expect(partnerName).toBe(expectedName);
          });
        });

        describe("when showIsLead is false", () => {
          test.each`
            name                                               | partnerObject                                 | expectedName
            ${"when showIsLead is false with isLead is false"} | ${{ ...stubWithdrawnPartner, isLead: false }} | ${`${stubWithdrawnPartner.name} (withdrawn)`}
            ${"when showIsLead is false with isLead is true"}  | ${{ ...stubWithdrawnPartner, isLead: true }}  | ${`${stubWithdrawnPartner.name} (withdrawn)`}
          `("$name", ({ partnerObject, expectedName }) => {
            const partnerName = getPartnerName(partnerObject);

            expect(partnerName).toBe(expectedName);
          });
        });
      });

      describe("when showWidthdrawn is false", () => {
        test.each`
          name                                               | partnerObject                                 | showIsLead | expectedName
          ${"when showIsLead is true with isLead is false"}  | ${{ ...stubWithdrawnPartner, isLead: false }} | ${true}    | ${stubWithdrawnPartner.name}
          ${"when showIsLead is true with isLead is true"}   | ${{ ...stubWithdrawnPartner, isLead: true }}  | ${true}    | ${`${stubWithdrawnPartner.name} (Lead)`}
          ${"when showIsLead is false with isLead is false"} | ${{ ...stubWithdrawnPartner, isLead: false }} | ${false}   | ${stubWithdrawnPartner.name}
          ${"when showIsLead is false with isLead is true"}  | ${{ ...stubWithdrawnPartner, isLead: true }}  | ${false}   | ${stubWithdrawnPartner.name}
        `("$name", ({ partnerObject, showIsLead, expectedName }) => {
          const partnerName = getPartnerName(partnerObject, showIsLead, false);

          expect(partnerName).toBe(expectedName);
        });
      });
    });
  });
});
