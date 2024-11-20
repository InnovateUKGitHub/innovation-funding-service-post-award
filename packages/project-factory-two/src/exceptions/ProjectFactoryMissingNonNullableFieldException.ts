class ProjectFactoryMissingNonNullableFieldException extends Error {
  constructor({ sobject, fields }: { sobject: string; fields: string[] }) {
    super(`Missing required field${fields.length === 1 ? "s" : ""} when creating '${sobject}': ${fields.join(", ")}`);
  }
}

export { ProjectFactoryMissingNonNullableFieldException };
