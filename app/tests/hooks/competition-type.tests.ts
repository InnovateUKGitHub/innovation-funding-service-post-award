import { renderHook } from "@testing-library/react-hooks";

import { hookTestBed } from "@shared/TestBed";
import { useCompetitionType } from "@ui/hooks";
import { Pending } from "@shared/pending";
import { LoadingStatus } from "@framework/constants";

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
              } as any,
            },
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
                } as any,
              },
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
                } as any,
              },
            }),
          );

          expect(mockBadResponse).toHaveBeenCalledTimes(1);
          expect(result.current).toBeUndefined();
        });
      });

      describe("with errors", () => {
        test("when a project query returns as failed", () => {
          const stubProjectId = "123456";
          const mockLoadingError = jest
            .fn()
            .mockReturnValue(new Pending(LoadingStatus.Failed, { competitionType: stubProjectId }));

          const { result } = renderHook(
            () => useCompetitionType(stubProjectId),
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
            new Error(`There was an error getting the competitionType from projectId - ${stubProjectId}`),
          );
        });

        test("when a project query contains an error", () => {
          const stubProjectId = "123456";
          const mockLoadingError = jest
            .fn()
            .mockReturnValue(new Pending(LoadingStatus.Done, { competitionType: stubProjectId }, "There is an error"));

          const { result } = renderHook(
            () => useCompetitionType(stubProjectId),
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
            new Error(`There was an error getting the competitionType from projectId - ${stubProjectId}`),
          );
        });
      });
    });
  });
});
