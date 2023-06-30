export type TValidationError = { message?: string | null } | { [key: string]: TValidationError } | null | undefined;

export const mapErrors = (error: TValidationError, mappedErrors: string[] = []) => {
  if (error) {
    if ("message" in error && typeof error.message === "string") {
      mappedErrors.push(error?.message ?? "");
      return mappedErrors;
    } else {
      Object.values(error).forEach(e => mapErrors(e, mappedErrors));
    }
  }

  return mappedErrors;
};
