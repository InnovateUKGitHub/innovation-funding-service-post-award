import { ProjectFactoryAwaitTimeoutException } from "../exceptions/ProjectFactoryAwaitTimeoutException";
import { awaitResults } from "./awaitResults";

describe("awaitResults", () => {
  test("rejects after loop count exceeds limit", async () => {
    await expect(awaitResults(async () => [], { time: 10, attempts: 5 })).rejects.toThrow(
      ProjectFactoryAwaitTimeoutException,
    );
  });

  test("resolves after results returned", async () => {
    let count = 0;
    const getItems = async () => {
      count++;
      if (count > 5) return ["hello!"];
      return [];
    };

    await expect(awaitResults(getItems, { time: 10, attempts: 10 })).resolves.toMatchObject(["hello!"]);
  });
});
