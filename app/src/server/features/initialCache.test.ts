import { IContext } from "@framework/types";
import { fetchCaches } from "./initialCache";

const logger = {
  info: jest.fn(),
  error: jest.fn(),
};

const config = {
  serverUrl: "https://ukri.org",
};

const runQuery = jest.fn();

const context = {
  logger,
  config,
  runQuery,
} as unknown as IContext;

beforeEach(jest.clearAllMocks);

describe("initialCache", () => {
  it("should initialise the cache", async () => {
    await fetchCaches(context);
    expect(runQuery.mock.calls).toMatchSnapshot();
    expect(logger.info.mock.calls).toMatchSnapshot();
  });

  it("should initialise log errors if the attempt to query fails", async () => {
   const failedContext = {
    ...context,
    runQuery: jest.fn().mockImplementation(() => {
throw new Error("bang!");
})
   } as unknown as IContext;
    await fetchCaches(failedContext);

    expect(logger.error.mock.calls).toMatchSnapshot();
  });

  it("should not initialise the cache if not prod (not https domain)", async () => {
    const notProdContext = { ...context, config: { serverUrl: "http://acc-dev.ukri.org" } } as unknown as IContext;
    await fetchCaches(notProdContext);
    expect(runQuery).not.toBeCalled();
    expect(logger.info).not.toBeCalled();
  });
});
