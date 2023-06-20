import { ErrorCode } from "@framework/constants/enums";
import { Results } from "@ui/validation/results";

export interface IAppError {
  code: ErrorCode;
  message: string;
  results?: Results<ResultBase> | null;
  stack?: string;
}
