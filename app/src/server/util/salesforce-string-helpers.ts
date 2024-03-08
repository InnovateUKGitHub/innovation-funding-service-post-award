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

type SalesforceSoqlSanitisable = string | number | Date;
type SalesforceSoqlSanitiserInput =
  | SalesforceSoqlSanitisable
  | ReadonlyArray<SalesforceSoqlSanitisable>
  | Array<SalesforceSoqlSanitisable>;

/**
 * Salesforce SOQL Sanitiser
 * Sanitises the input value to ensure SQL injection attacks are _less likely_ to occur
 *
 * @see https://developer.salesforce.com/docs/atlas.en-us.secure_coding_guide.meta/secure_coding_guide/secure_coding_sql_injection.htm
 * @param x The unsanitised value to inject into the SQL query
 * @example queryString += ` AND Description = '${sss(filter.description)}'`;
 * @deprecated Use the `soql` string template to sanitise strings
 */
export function sss(x: SalesforceSoqlSanitiserInput): string {
  if (typeof x === "number") {
    if (x >= Number.MAX_SAFE_INTEGER) throw new Error("Number greater than MAX_SAFE_INTEGER");
    if (x <= Number.MIN_SAFE_INTEGER) throw new Error("Number less than than MIN_SAFE_INTEGER");

    return String(x);
  }

  if (x instanceof Date) {
    // Convert dates to the Salesforce accepted format.
    // https://developer.salesforce.com/docs/atlas.en-us.apexref.meta/apexref/apex_methods_system_date.htm#apex_System_Date_valueOf
    return `date.valueOf('${x.toISOString().replace("T", " ").split(".")[0]}')`;
  }

  if (Array.isArray(x)) {
    // sss every single item and join them with commas
    return x.map(sss).join(", ");
  }

  if (typeof x === "string") {
    return x.replaceAll("'", "\\'");
  }

  throw new Error(`Invalid input type to apex sanitiser: ${x}`);
}

/**
 * SOQL template string generator
 * Injects strings, numbers and dates (only!) into a SOQL string.
 */
export function soql(strings: TemplateStringsArray, ...values: SalesforceSoqlSanitiserInput[]) {
  // Start off with just the output string.
  let outputString = "";

  const sanitise = (x: SalesforceSoqlSanitiserInput): string => {
    if (typeof x === "number") {
      if (x >= Number.MAX_SAFE_INTEGER) throw new Error("Number greater than MAX_SAFE_INTEGER");
      if (x <= Number.MIN_SAFE_INTEGER) throw new Error("Number less than than MIN_SAFE_INTEGER");
      return String(x);
    }

    if (x instanceof Date) {
      // Convert dates to the Salesforce accepted format.
      // https://developer.salesforce.com/docs/atlas.en-us.apexref.meta/apexref/apex_methods_system_date.htm#apex_System_Date_valueOf
      return `date.valueOf('${x.toISOString().replace("T", " ").split(".")[0]}')`;
    }

    if (Array.isArray(x)) {
      // sss every single item and join them with commas
      return "(" + x.map(sanitise).join(", ") + ")";
    }

    if (typeof x === "string") {
      return "'" + x.replaceAll("'", "\\'") + "'";
    }

    throw new Error(`Invalid input type to apex sanitiser: ${x}`);
  };

  // For each item in the strings/values array...
  for (let i = 0; i < Math.max(strings.length, values.length); i++) {
    const currentString = strings[i];
    const currentValue = values[i];

    outputString += currentString;
    if (typeof currentValue !== "undefined") outputString += sanitise(currentValue);
  }

  return outputString.trim();
}
