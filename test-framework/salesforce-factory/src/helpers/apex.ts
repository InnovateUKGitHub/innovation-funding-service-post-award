import { AccFactoryInstance } from "../factory/AccFactory";
import { FieldsToRecord } from "../types/SffFactoryDefinition";

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

/**
 * SOQL template string generator
 * Injects strings, numbers and dates (only!) into a SOQL string.
 */
export function soql(strings: TemplateStringsArray, ...values: unknown[]) {
  // Start off with just the output string.
  let outputString = "";

  // For each item in the strings/values array...
  for (let i = 0; i < Math.max(strings.length, values.length); i++) {
    const currentString = strings[i];
    const currentValue = values[i];

    outputString += currentString;
    if (typeof currentValue !== "undefined") outputString += sss(currentValue);
  }

  return outputString.trim();
}

const injectFieldToApex = (instanceName: string, instanceFieldName: string, value: unknown) => {
  try {
    return `${instanceName}.${instanceFieldName} = ${sss(value)};`;
  } catch {
    throw new Error(`Cannot convert ${instanceName}.${instanceFieldName} value ${String(value)}`);
  }
};

const injectFieldsToApex = (instanceName: string, fields: FieldsToRecord<any>) =>
  Object.entries(fields)
    .map(([key, value]) => injectFieldToApex(instanceName, key, value))
    .join("\n");

const injectRelationshipToApex = (
  instanceName: string,
  instanceRelFieldName: string,
  relationship: AccFactoryInstance<any>,
) => {
  if (!relationship)
    throw new Error(`Cannot find the required relationship of ${instanceName}.${instanceRelFieldName}`);
  return `${instanceName}.${instanceRelFieldName} = ${relationship.instanceName}.Id;`;
};

const buildApex = (instances: AccFactoryInstance<any>[]) => {
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
    .flatMap(x => x.build())
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
