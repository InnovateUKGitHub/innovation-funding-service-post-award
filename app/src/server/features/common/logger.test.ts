import { LogLevel } from "@framework/constants";
import { Logger } from "./logger";

describe("Logger", () => {
  jest.spyOn(console, "info").mockImplementation();

  beforeEach(jest.clearAllMocks);

  it("should create a logger instance", () => {
    const logger = new Logger("test", LogLevel.VERBOSE, true);

    expect(logger).toBeInstanceOf(Logger);
  });
});
