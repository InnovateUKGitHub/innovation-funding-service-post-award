import { checkProjectCompetition } from "@ui/helpers/check-competition-type";

describe("checkProjectCompetition()", () => {
  const stubResponse: ReturnType<typeof checkProjectCompetition> = {
    isCRandD: false,
    isContracts: false,
    isContractsForInnovation: false,
    isKTP: false,
    isCatapults: false,
    isLoans: false,
    isEdge: false,
    isHorizonEuropeParticipation: false,
  };

  describe("@returns", () => {
    test.each`
      name                                       | inboundCompetition            | expectedPayload
      ${"when no competition value is supplied"} | ${""}                         | ${stubResponse}
      ${"with CR&D"}                             | ${"CR&D"}                     | ${{ ...stubResponse, isCRandD: true }}
      ${"with KTP"}                              | ${"KTP"}                      | ${{ ...stubResponse, isKTP: true }}
      ${"with Contracts"}                        | ${"CONTRACTS"}                | ${{ ...stubResponse, isContracts: true }}
      ${"with Catapults"}                        | ${"CATAPULTS"}                | ${{ ...stubResponse, isCatapults: true }}
      ${"with Loans"}                            | ${"LOANS"}                    | ${{ ...stubResponse, isLoans: true }}
      ${"with Edge"}                             | ${"EDGE"}                     | ${{ ...stubResponse, isEdge: true }}
      ${"with SBRI"}                             | ${"SBRI"}                     | ${{ ...stubResponse, isContractsForInnovation: true }}
      ${"with SBRI IFS"}                         | ${"SBRI IFS"}                 | ${{ ...stubResponse, isContractsForInnovation: true }}
      ${"with Contracts for Innovation"}         | ${"Contracts for Innovation"} | ${{ ...stubResponse, isContractsForInnovation: true }}
    `("$name", ({ inboundCompetition, expectedPayload }) => {
      const competitionPayload = checkProjectCompetition(inboundCompetition);

      expect(competitionPayload).toStrictEqual(expectedPayload);
    });
  });
});
