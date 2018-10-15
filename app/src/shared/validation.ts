import {Results} from "../ui/validation/results";

export class ValidationError extends Error {
  constructor(public readonly validationResult: Results<{}>) {
    super();
  }
}