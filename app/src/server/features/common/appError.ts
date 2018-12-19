import { ErrorCode, IAppError } from "../../../types/IAppError";
import { Results } from "../../../ui/validation/results";

export class AppError implements IAppError {
  constructor(public code: ErrorCode, public details: string | Results<{}>, public original?: Error) {
  }
}
