import { renderHook } from "@testing-library/react";
import { hookTestBed } from "@shared/TestBed";
import { LoadingStatus } from "@framework/constants/enums";
import { Pending } from "@shared/pending";
import { IStores } from "@ui/redux/storesProvider";
import { useCompetitionType } from "./competition-type.hook";

describe("useCompetitionType()", () => {
  beforeEach(jest.clearAllMocks);

  describe("@returns", () => {
    const stubProjectId = "123456" as ProjectId;

    describe("with valid response", () => {
      test("with valid payload", () => {
        const mockCompetitionType = "stub-competitionType";
        const mockGetById = jest
          .fn()
          .mockReturnValue(new Pending(LoadingStatus.Done, { competitionType: mockCompetitionType }));

        const { result } = renderHook(
          () => useCompetitionType(stubProjectId),
          hookTestBed({
            stores: {
              projects: {
                getById: mockGetById,
              },
            } as unknown as IStores,
          }),
        );

        expect(result.current).toBe(mockCompetitionType);
        expect(mockGetById).toHaveBeenCalledTimes(1);
      });
    });

    describe("with no competitionType response", () => {
      describe("with no errors", () => {
        test("with no projectId", () => {
          const mockLoadingError = jest.fn();

          const { result } = renderHook(
            () => useCompetitionType(undefined),
            hookTestBed({
              stores: {
                projects: {
                  getById: mockLoadingError,
                },
              } as unknown as IStores,
            }),
          );

          expect(mockLoadingError).toHaveBeenCalledTimes(0);
          expect(result.current).toBeUndefined();
        });

        test("with no valid response from a pending", () => {
          const mockBadResponse = jest.fn().mockReturnValue(new Pending(LoadingStatus.Done, { competitionType: null }));

          const { result } = renderHook(
            () => useCompetitionType(stubProjectId),
            hookTestBed({
              stores: {
                projects: {
                  getById: mockBadResponse,
                },
              } as unknown as IStores,
            }),
          );

          expect(mockBadResponse).toHaveBeenCalledTimes(1);
          expect(result.current).toBeUndefined();
        });
      });

      describe("with errors", () => {
        // TODO: Figure out a better way to silencing console errors for thrown expect's...
        jest.spyOn(console, "error").mockImplementation(jest.fn);

        test("when a project query returns as failed", () => {
          const mockLoadingError = jest
            .fn()
            .mockReturnValue(new Pending(LoadingStatus.Failed, { competitionType: stubProjectId }));

          expect(() =>
            renderHook(
              () => useCompetitionType(stubProjectId),
              hookTestBed({
                stores: {
                  projects: {
                    getById: mockLoadingError,
                  },
                } as unknown as IStores,
              }),
            ),
          ).toThrow(`There was an error getting the competitionType from projectId - ${stubProjectId}`);
        });

        test("with error message", () => {
          const stubError = "There is an error";
          const mockLoadingError = jest.fn().mockReturnValue(new Pending(LoadingStatus.Failed, undefined, stubError));

          expect(() =>
            renderHook(
              () => useCompetitionType(stubProjectId),
              hookTestBed({
                stores: {
                  projects: {
                    getById: mockLoadingError,
                  },
                } as unknown as IStores,
              }),
            ),
          ).toThrow(stubError);
        });

        test("with no error", () => {
          const mockLoadingError = jest.fn().mockReturnValue(new Pending(LoadingStatus.Failed, undefined));

          expect(() =>
            renderHook(
              () => useCompetitionType(stubProjectId),
              hookTestBed({
                stores: {
                  projects: {
                    getById: mockLoadingError,
                  },
                } as unknown as IStores,
              }),
            ),
          ).toThrow(`There was an error getting the competitionType from projectId - ${stubProjectId}`);
        });
      });
    });
  });
});
