import { SffBuilderInstance } from "../factory/SffBuilder";
import { FieldsToRecord } from "../types/SffFactoryDefinition";

/**
 * Salesforce SQL Sanitiser
 * Sanitises the input value to ensure SQL injection attacks are _less likely_ to occur
 *
 * @see https://developer.salesforce.com/docs/atlas.en-us.secure_coding_guide.meta/secure_coding_guide/secure_coding_sql_injection.htm
 * @param x The unsanitised value to inject into the SQL query
 * @example queryString += ` AND Description = '${sss(filter.description)}'`;
 */
function sss(x: string | number | Date): string {
  if (typeof x === "number") {
    if (x >= Number.MAX_SAFE_INTEGER) throw new Error("Number greater than MAX_SAFE_INTEGER");
    if (x <= Number.MIN_SAFE_INTEGER) throw new Error("Number less than than MIN_SAFE_INTEGER");

    return String(x);
  }

  if (typeof x === "string") {
    return "'" + x.replace(/'/g, "\\'") + "'";
  }

  if (x instanceof Date) {
    return `date.valueOf('${x.toISOString().replace("T", " ").split(".")[0]}')`;
  }

  throw new Error("Cannot convert value " + String(x));
}

const injectFieldsToApex = (variableName: string, fields: FieldsToRecord<any>) =>
  Object.entries(fields)
    .map(([key, value]) => `${variableName}.${key} = ${sss(value)};`)
    .join("\n");

const injectRelationshipToApex = (
  parentVarName: string,
  parentFieldName: string,
  relationship: SffBuilderInstance<any>,
) => {
  const { varName: childVarName } = relationship.build();
  return `${parentVarName}.${parentFieldName} = idMap.get('${childVarName}');`;
};

const injectRelationshipsToApex = (variableName: string, relationships: SffBuilderInstance<any>[] = []) =>
  relationships.map(x => injectRelationshipToApex(variableName, x)).join("\n");

export { sss, injectFieldsToApex, injectRelationshipToApex, injectRelationshipsToApex };
