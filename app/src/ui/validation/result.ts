/** global window */
import { Results } from "./results";

interface ResultsInternal {
  add(result: Result): void;
}

/**
 * implementation inspired by reach-ui/autoid
 *
 * defaults to Val:0 for server side, but once mounted will be given an incremental id
 *
 * @see https://github.com/reach/reach-ui/blob/dev/packages/auto-id/src/index.tsx
 */

let hasMounted = false;
let keyVal = 0;

function getKey() {
  return `Val:${++keyVal}`;
}

// A single validation result, typically for a single field
export class Result {
  private pKey = "Val:0";

  constructor(
    results: Results<{}> | null,
    public readonly showValidationErrors: boolean,
    public readonly isValid: boolean,
    public readonly errorMessage: string | null,
    public readonly isRequired: boolean,
  ) {
    const internalResults = results as any as ResultsInternal;

    if (internalResults) {
      internalResults.add(this);
    }

    // replace static id with incremental id after mounting
    if (hasMounted) {
      this.pKey = getKey();
    } else {
      global.window?.requestAnimationFrame(() => {
        hasMounted = true;
        this.pKey = getKey();
      });
    }
  }

  get key() {
    return this.pKey;
  }

  public combine(other: Result) {
    return new Result(
      null,
      this.showValidationErrors || other.showValidationErrors,
      this.isValid && other.isValid,
      this.errorMessage || other.errorMessage || "",
      this.isRequired || other.isRequired,
    );
  }

  public log() {
    if (this.isValid) return null;
    return this.errorMessage;
  }
}
