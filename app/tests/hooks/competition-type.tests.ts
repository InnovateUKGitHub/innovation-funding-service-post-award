import { renderHook } from "@testing-library/react-hooks";

import { hookTestBed } from "@shared/TestBed";
import { useCompetitionType, projectCompetition, useCompetitionTypeArgs } from "@ui/hooks";
import { LoadingStatus, Pending } from "@shared/pending";

describe("useCompetitionType()", () => {
  beforeEach(jest.clearAllMocks);

  describe("@returns", () => {
    describe("with errors", () => {
      test("when a project has an error loading", () => {
        const mockLoadingError = jest.fn().mockReturnValue(new Pending(LoadingStatus.Failed));
        const stubProjectId = "123456";

        const { result } = renderHook(
          () => useCompetitionType({ projectId: stubProjectId }),
          hookTestBed({
            stores: {
              projects: {
                getById: mockLoadingError,
              } as any,
            },
          }),
        );

        expect(mockLoadingError).toHaveBeenCalledTimes(1);
        expect(() => result.current).toThrowError(
          new Error(
            `There was an error fetching your project using id '${stubProjectId}', a competition type could not be used.`,
          ),
        );
      });

      test("when a request contains errors", () => {
        const mockLoadingError = jest.fn().mockReturnValue(new Pending(LoadingStatus.Done, {}, "There is an error"));
        const stubProjectId = "123456";

        const { result } = renderHook(
          () => useCompetitionType({ projectId: stubProjectId }),
          hookTestBed({
            stores: {
              projects: {
                getById: mockLoadingError,
              } as any,
            },
          }),
        );

        expect(mockLoadingError).toHaveBeenCalledTimes(1);
        expect(() => result.current).toThrowError(
          new Error(
            `There was an error fetching your project using id '${stubProjectId}', a competition type could not be used.`,
          ),
        );
      });
    });

    describe("with valid response", () => {
      const mockCompetitionType = "stub-competitionType";
      const mockGetById = jest.fn().mockReturnValue({
        data: {
          competitionType: mockCompetitionType,
        },
      });

      const setup = (params: useCompetitionTypeArgs) => {
        return renderHook(
          () => useCompetitionType(params),
          hookTestBed({
            stores: {
              projects: {
                getById: mockGetById,
              } as any,
            },
          }),
        );
      };

      test.each`
        name                                  | inboundParams              | expectedValue
        ${"with params containing projectId"} | ${{ projectId: "123456" }} | ${mockCompetitionType}
        ${"with params containing id"}        | ${{ id: "123456" }}        | ${mockCompetitionType}
      `("$name", ({ inboundParams, expectedValue }) => {
        const { result } = setup(inboundParams);

        expect(result.current).toBe(expectedValue);
        expect(mockGetById).toHaveBeenCalledTimes(1);
      });
    });
  });
});

describe("projectCompetition()", () => {
  const stubResponse = {
    isCRandD: false,
    isContracts: false,
    isSBRI: false,
    isSBRI_IFS: false,
    isCombinationOfSBRI: false,
    isKTP: false,
    isCatapults: false,
    isLoans: false,
  };

  describe("@returns", () => {
    test.each`
      name                                       | inboundCompetition | expectedPayload
      ${"when no competition value is supplied"} | ${""}              | ${stubResponse}
      ${"with CR&D"}                             | ${"CR&D"}          | ${{ ...stubResponse, isCRandD: true }}
      ${"with KTP"}                              | ${"KTP"}           | ${{ ...stubResponse, isKTP: true }}
      ${"with Contracts"}                        | ${"CONTRACTS"}     | ${{ ...stubResponse, isContracts: true }}
      ${"with Catapults"}                        | ${"CATAPULTS"}     | ${{ ...stubResponse, isCatapults: true }}
      ${"with Loans"}                            | ${"LOANS"}         | ${{ ...stubResponse, isLoans: true }}
      ${"with SBRI"}                             | ${"SBRI"}          | ${{ ...stubResponse, isCombinationOfSBRI: true, isSBRI: true }}
      ${"with SBRI IFS"}                         | ${"SBRI IFS"}      | ${{ ...stubResponse, isCombinationOfSBRI: true, isSBRI_IFS: true }}
    `("$name", ({ inboundCompetition, expectedPayload }) => {
      const competitionPayload = projectCompetition(inboundCompetition);

      expect(competitionPayload).toStrictEqual(expectedPayload);
    });
  });
});
