import { LoadingStatus } from "@framework/constants";
import { Pending } from "@shared/pending";
import { getPending } from "@ui/helpers/get-pending";

describe("getPending()", () => {
  describe("@returns", () => {
    describe("with loading", () => {
      test("when data is empty", () => {
        const loadingNoDataPending = new Pending(LoadingStatus.Loading);
        const value = getPending(loadingNoDataPending);

        expect(value).toMatchInlineSnapshot(`
          Object {
            "error": undefined,
            "isIdle": false,
            "isLoading": true,
            "isRejected": false,
            "isResolved": false,
            "payload": undefined,
          }
        `);
      });

      test("when data is defined", () => {
        const loadingWithDataPending = new Pending(LoadingStatus.Loading, "defined-data");
        const value = getPending(loadingWithDataPending);

        expect(value).toMatchInlineSnapshot(`
          Object {
            "error": undefined,
            "isIdle": false,
            "isLoading": false,
            "isRejected": false,
            "isResolved": true,
            "payload": "defined-data",
          }
        `);
      });
    });

    test("with Preload pending", () => {
      const preloadPending = new Pending(LoadingStatus.Preload);
      const value = getPending(preloadPending);

      expect(value).toMatchInlineSnapshot(`
        Object {
          "error": undefined,
          "isIdle": true,
          "isLoading": true,
          "isRejected": false,
          "isResolved": false,
          "payload": undefined,
        }
      `);
    });

    describe("with Stale pending", () => {
      test("when data is empty", () => {
        const staleNoDataPending = new Pending(LoadingStatus.Stale);
        const value = getPending(staleNoDataPending);

        expect(value).toMatchInlineSnapshot(`
          Object {
            "error": undefined,
            "isIdle": false,
            "isLoading": true,
            "isRejected": false,
            "isResolved": false,
            "payload": undefined,
          }
        `);
      });

      test("when data is defined", () => {
        const staleDataPending = new Pending(LoadingStatus.Stale, "defined-data");
        const value = getPending(staleDataPending);

        expect(value).toMatchInlineSnapshot(`
          Object {
            "error": undefined,
            "isIdle": false,
            "isLoading": false,
            "isRejected": false,
            "isResolved": true,
            "payload": "defined-data",
          }
        `);
      });
    });

    describe("with Failed pending", () => {
      test("with no error", () => {
        const failedNoErrorPending = new Pending(LoadingStatus.Failed);
        const value = getPending(failedNoErrorPending);

        expect(value).toMatchInlineSnapshot(`
          Object {
            "error": undefined,
            "isIdle": false,
            "isLoading": false,
            "isRejected": true,
            "isResolved": false,
            "payload": undefined,
          }
        `);
      });

      test("with error value", () => {
        const failedWithErrorPending = new Pending(LoadingStatus.Failed, undefined, "stub-error");
        const value = getPending(failedWithErrorPending);

        expect(value).toMatchInlineSnapshot(`
          Object {
            "error": "stub-error",
            "isIdle": false,
            "isLoading": false,
            "isRejected": true,
            "isResolved": false,
            "payload": undefined,
          }
        `);
      });
    });

    test("with Updated pending", () => {
      const updatedPending = new Pending(LoadingStatus.Updated);
      const value = getPending(updatedPending);

      expect(value).toMatchInlineSnapshot(`
        Object {
          "error": undefined,
          "isIdle": false,
          "isLoading": false,
          "isRejected": false,
          "isResolved": true,
          "payload": undefined,
        }
      `);
    });

    test("with Done pending", () => {
      const donePending = new Pending(LoadingStatus.Done);
      const value = getPending(donePending);

      expect(value).toMatchInlineSnapshot(`
        Object {
          "error": undefined,
          "isIdle": false,
          "isLoading": false,
          "isRejected": false,
          "isResolved": true,
          "payload": undefined,
        }
      `);
    });
  });
});
