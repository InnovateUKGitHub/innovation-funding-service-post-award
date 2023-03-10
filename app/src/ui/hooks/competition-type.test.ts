import { renderHook } from "@testing-library/react";

import { hookTestBed } from "@shared/TestBed";
import { useCompetitionType } from "@ui/hooks";
import { Pending } from "@shared/pending";
import { LoadingStatus } from "@framework/constants";
import { IStores } from "@ui/redux";

describe("useCompetitionType()", () => {
  beforeEach(jest.clearAllMocks);

  describe("@returns", () => {
    describe("with valid response", () => {
      test("with valid payload", () => {
        const stubProjectId = "123456";
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
          const stubProjectId = undefined;

          const { result } = renderHook(
            () => useCompetitionType(stubProjectId),
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
          const stubProjectId = "1234";

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
          const stubProjectId = "123456";
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
          ).toThrowError(`There was an error getting the competitionType from projectId - ${stubProjectId}`);
        });

        test("with error message", () => {
          const stubProjectId = "123456";
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
          ).toThrowError(stubError);
        });

        test("with no error", () => {
          const stubProjectId = "123456";
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
          ).toThrowError(`There was an error getting the competitionType from projectId - ${stubProjectId}`);
        });
      });
    });
  });
});
