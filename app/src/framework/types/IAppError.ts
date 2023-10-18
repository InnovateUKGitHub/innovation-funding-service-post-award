import { ErrorCode } from "@framework/constants/enums";
import { Results } from "@ui/validation/results";

export interface IAppError<T extends Results<ResultBase> = Results<ResultBase>> {
  code: ErrorCode;
  message: string;
  results?: T | null;
  stack?: string;
}
