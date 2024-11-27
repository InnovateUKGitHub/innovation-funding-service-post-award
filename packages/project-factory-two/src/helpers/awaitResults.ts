import { ProjectFactoryAwaitTimeoutException } from "../exceptions/ProjectFactoryAwaitTimeoutException";
import { sleep } from "./sleep";

/**
 * Wait for a query to return results
 * @param fn The query to execute
 * @param time The amount of time to wait between queries. Default is 500ms.
 * @returns
 */
const awaitResults = async <T>(
  fn: () => Promise<T[]>,
  { time = 500, attempts = 50, log }: { time?: number; attempts?: number; log?: string } = {},
): Promise<T[]> => {
  let results: T[] = [];

  for (let i = 0; i < attempts; i++) {
    results = await fn();
    if (results.length) return results;
    if (log) console.log(`${log} Attempt ${i} of ${attempts}`);
    await sleep(time);
  }

  throw new ProjectFactoryAwaitTimeoutException();
};

export { awaitResults };
