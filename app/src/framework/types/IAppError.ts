import { ErrorCode } from "@framework/constants";
import { Results } from "@ui/validation/results";

export interface IAppError {
  code: ErrorCode;
  message: string;
  results?: Results<ResultBase> | null;
  stack?: string;
}
