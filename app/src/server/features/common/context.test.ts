import {
  SalesforceTokenError,
  SalesforceInvalidFilterError,
  FileTypeNotAllowedError,
} from "@server/repositories/errors";
import { Results } from "@ui/validation/results";
import { NotFoundError, ForbiddenError, ValidationError, BadRequestError, AppError } from "./appError";
import { AsyncCommandBase, SyncCommandBase } from "./commandBase";
import { constructErrorResponse, Context } from "./context";
import { AsyncQueryBase, SyncQueryBase } from "./queryBase";

describe("constructErrorResponse", () => {
  test.each`
    name            | error
    ${"NotFound"}   | ${new NotFoundError()}
    ${"Validation"} | ${new ValidationError({} as Results<AnyObject>)}
    ${"Forbidden"}  | ${new ForbiddenError()}
    ${"BadRequest"} | ${new BadRequestError()}
  `("should return the $nameError unchanged", ({ error }: { error: Error }) => {
    expect(constructErrorResponse(error)).toBe(error);
  });

  test.each`
    name                                                       | error
    ${"AppError if it is a SalesforceTokenError"}              | ${new SalesforceTokenError(new Error("stub-token-error"))}
    ${"NotFoundError if it is a SalesforceInvalidFilterError"} | ${new SalesforceInvalidFilterError("invalid-filter")}
    ${"AppError if it is a FileTypeNotAllowedError"}           | ${new FileTypeNotAllowedError("file-not-found")}
    ${"an unknown AppError"}                                   | ${new Error("unknown-error")}
  `("should return the configured $name", ({ error }: { error: Error }) => {
    const res = constructErrorResponse(error);
    expect(res).toBeInstanceOf(AppError);
    expect(res).toMatchSnapshot();
  });
});

describe("Context", () => {
  const context = new Context({ email: "user@email.com" });

  it("should contain the repositories", () => {
    expect(context.repositories).toMatchSnapshot();
  });

  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("public methods", () => {
    describe("runQuery", () => {
      it("should run a valid runnable async query", async () => {
        const response = { name: "mock result object" } as const;
        class TestQuery extends AsyncQueryBase<typeof response> {
          runnableName = "TestCommand";

          async run() {
            return response;
          }

          logMessage() {
            return { projectId: "zucchini" };
          }
        }

        const res = await context.runQuery(new TestQuery());

        expect(res).toEqual(response);
      });
    });

    describe("runSyncQuery", () => {
      it("should run a valid runnable synchronous query", () => {
        const response = { name: "mock result object" } as const;

        class TestQuery extends SyncQueryBase<typeof response> {
          runnableName = "TestCommand";

          run() {
            return response;
          }

          logMessage() {
            return { projectId: "zucchini" };
          }
        }

        const res = context.runSyncQuery(new TestQuery());

        expect(res).toEqual(response);
      });
    });

    describe("runCommand", () => {
      it("should run a valid runnable async command", async () => {
        const response = { name: "mock result object" };

        class TestCommand extends AsyncCommandBase<typeof response> {
          runnableName = "TestCommand";

          async run() {
            return response;
          }

          logMessage() {
            return { projectId: "zucchini" };
          }
        }

        const res = await context.runCommand(new TestCommand());

        expect(res).toEqual(response);
      });
    });

    describe("runSyncCommand", () => {
      it("should run a valid runnable synchronous command", () => {
        const response = { name: "mock result object" } as const;
        class TestCommand extends SyncCommandBase<typeof response> {
          runnableName = "TestCommand";

          run() {
            return response;
          }

          logMessage() {
            return { projectId: "zucchini" };
          }
        }

        const res = context.runSyncCommand(new TestCommand());
        expect(res).toEqual(response);
      });
    });

    describe("asSystemUser", () => {
      it("should return the context as a system user", () => {
        const systemUserEmail = context.asSystemUser().user;

        expect(systemUserEmail).not.toEqual({ email: "user@email.com" });
        expect(systemUserEmail).toEqual({ email: "" });
      });
    });
  });
});
