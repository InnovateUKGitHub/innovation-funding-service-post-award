import { ProjectFactoryInstance } from "../factory/ProjectFactory";
import {
  ProjectFactoryBuildOptions,
  ProjectFactoryField,
  ProjectFactoryFieldsToRecord,
  ProjectFactoryFieldType,
  ProjectFactoryRelationship,
} from "../types/ProjectFactoryDefinition";

/**
 * Salesforce SQL Sanitiser
 * Sanitises the input value to ensure SQL injection attacks are _less likely_ to occur
 *
 * @see https://developer.salesforce.com/docs/atlas.en-us.secure_coding_guide.meta/secure_coding_guide/secure_coding_sql_injection.htm
 * @param x The unsanitised value to inject into the SQL query
 * @example queryString += ` AND Description = '${sss(filter.description)}'`;
 */
function sss(x: unknown): string {
  if (typeof x === "number") {
    if (x >= Number.MAX_SAFE_INTEGER) throw new Error("Number greater than MAX_SAFE_INTEGER");
    if (x <= Number.MIN_SAFE_INTEGER) throw new Error("Number less than than MIN_SAFE_INTEGER");

    return String(x);
  }

  if (typeof x === "string") {
    return "'" + x.replace(/'/g, "\\'") + "'";
  }

  if (typeof x === "boolean") {
    return x ? "true" : "false";
  }

  if (x instanceof Date) {
    return `date.valueOf('${x.toISOString().replace("T", " ").split(".")[0]}')`;
  }

  throw new Error("Cannot convert value " + String(x));
}

const injectFieldToApex = (
  options: ProjectFactoryBuildOptions,
  instanceName: string,
  instanceFieldName: string,
  field: { value: unknown; meta: ProjectFactoryField },
): string => {
  let value: any = field.value;

  if (
    typeof value === "string" &&
    typeof options.prefix === "string" &&
    field.meta.sfdcType === ProjectFactoryFieldType.STRING &&
    field.meta.prefixed
  ) {
    value = options.prefix + value;
  }

  try {
    value = sss(value);
  } catch {
    if (field.meta.nullable) {
      return `// ${instanceName}.${instanceFieldName} field is not defined`;
    } else {
      throw new Error(`Cannot convert ${instanceName}.${instanceFieldName} value ${String(value)}`);
    }
  }

  return `${instanceName}.${instanceFieldName} = ${value};`;
};

const injectFieldsToApex = (
  options: ProjectFactoryBuildOptions,
  instanceName: string,
  fields: ProjectFactoryFieldsToRecord<any>,
) =>
  Object.entries(fields)
    .map(([key, value]) => injectFieldToApex(options, instanceName, key, value))
    .join("\n");

const injectRelationshipToApex = (
  instanceName: string,
  instanceRelFieldName: string,
  relationship: { value: ProjectFactoryInstance<any>; meta: ProjectFactoryRelationship },
): string | null => {
  if (!relationship.value) {
    if (relationship.meta.required) {
      throw new Error(`Cannot find the required relationship of ${instanceName}.${instanceRelFieldName}`);
    } else {
      return `// ${instanceName}.${instanceRelFieldName} relationship is not defined`;
    }
  }
  return `${instanceName}.${instanceRelFieldName} = ${relationship.value.instanceName}.Id;`;
};

const buildApex = ({
  instances,
  options,
}: {
  instances: ProjectFactoryInstance<any>[];
  options?: ProjectFactoryBuildOptions;
}) => {
  const missingSet = new Set<string>();

  for (const instance of instances) {
    missingSet.add(instance.instanceName);
    for (const relationship of instance.relationships.values()) {
      missingSet.add(relationship.instanceName);
    }
  }

  for (const instance of instances) {
    missingSet.delete(instance.instanceName);
  }

  if (missingSet.size !== 0) {
    throw new Error(`Missing values in missingSet: ${[...missingSet].join(", ")}`);
  }

  const code = instances
    .flatMap(x => x.build(options))
    .sort((a, b) => a.priority - b.priority)
    .map(x => formatApex(x.code))
    .join("");

  return code;
};

const formatApex = (apex: string) => {
  const lines = apex.split(/\r?\n/g);
  const whitespaceRegex = /^\s*/;

  let indent = Infinity;

  for (const line of lines) {
    // entire line is whitespace :(
    if (line.trim().length === 0) continue;

    const hasWhitespace = whitespaceRegex.exec(line);

    // If line starts with whitespace, set indent to smallest found indent (so far)
    // If line starts with no whitespace, bail
    if (hasWhitespace) {
      indent = Math.min(hasWhitespace[0].length, indent);
    } else {
      indent = 0;
      break;
    }
  }

  return lines.map(line => line.substring(indent)).join("\n");
};

export { sss, injectFieldToApex, injectFieldsToApex, injectRelationshipToApex, buildApex, formatApex };
