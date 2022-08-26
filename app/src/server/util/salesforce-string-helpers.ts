export function parseSfLongTextArea(unParsedString: string): string[] {
  return unParsedString
    .trim()
    .split("\n")
    .map(x => x.trim())
    .filter(x => x);
}

/**
 * Salesforce SQL Sanitiser
 * Sanitises the input value to ensure SQL injection attacks are _less likely_ to occur
 *
 * @author Leondro Lio <leondro.lio@iuk.ukri.org>
 * @see https://developer.salesforce.com/docs/atlas.en-us.secure_coding_guide.meta/secure_coding_guide/secure_coding_sql_injection.htm
 * @param unsanitisedValue The unsanitised value to inject into the SQL query
 * @example queryString += ` AND Description = '${sss(filter.description)}'`;
 */
export function sss(unsanitisedValue: string | number): string {
  if (typeof unsanitisedValue === "number") {
    if (unsanitisedValue >= Number.MAX_SAFE_INTEGER) throw new Error("Number greater than MAX_SAFE_INTEGER");
    if (unsanitisedValue <= Number.MIN_SAFE_INTEGER) throw new Error("Number less than than MIN_SAFE_INTEGER");

    return String(unsanitisedValue);
  }

  // TODO: When in NodeJS 16, use the replaceAll API from ES2021
  // https://github.com/tc39/proposal-string-replaceall
  return unsanitisedValue
    .replace(/'/g, "\\'");
}
