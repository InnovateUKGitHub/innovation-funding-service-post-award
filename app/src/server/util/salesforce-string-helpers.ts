/**
 * Takes text area and splits into an array of trimmed strings
 */
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
  return unsanitisedValue.replace(/'/g, "\\'");
}

/**
 * Apex Injector
 * Injects strings, numbers and dates (only!) into a SOQL string.
 *
 * Do not wrap variables in quotes `"` or `'`.
 */
export function apex(strings: TemplateStringsArray, ...values: (string | number | Date)[]) {
  // Start off with just the output string.
  let outputString = "";

  // For each item in the strings/values array...
  for (let i = 0; i < Math.max(strings.length, values.length); i++) {
    const currentString = strings[i];
    const currentValue = values[i];

    outputString += currentString;

    if (typeof currentValue === "string") {
      // If our input variable is a string, escape any quotes within it.
      outputString += `'${currentValue.replace(/'/g, "'")}'`;
    } else if (typeof currentValue === "number") {
      // If our input variable is a number, check if it's too big/small to be potentially accepted by Salesforce
      if (currentValue >= Number.MAX_SAFE_INTEGER) throw new Error("Number greater than MAX_SAFE_INTEGER");
      if (currentValue <= Number.MIN_SAFE_INTEGER) throw new Error("Number less than than MIN_SAFE_INTEGER");
      outputString += `${currentValue}`;
    } else if (currentValue instanceof Date) {
      // Convert dates to the Salesforce accepted format.
      // https://developer.salesforce.com/docs/atlas.en-us.apexref.meta/apexref/apex_methods_system_date.htm#apex_System_Date_valueOf
      outputString += `date.valueOf('${currentValue.toISOString().replace("T", " ").split(".")[0]}')`;
    }
  }

  // Add a few newlines, just in case the input template string does not.
  outputString += "\n\n";

  return outputString;
}
