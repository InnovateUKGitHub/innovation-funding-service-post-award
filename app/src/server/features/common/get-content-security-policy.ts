// https://developers.google.com/web/fundamentals/security/csp#policy_applies_to_a_wide_variety_of_resources
const cspSourceKeyWords: Readonly<string[]> = ["none", "self", "unsafe-inline", "unsafe-eval"];
const quotedKeywords: Readonly<string[]> = [...cspSourceKeyWords, "nonce", "strict-dynamic"];

type CspPolicySources =
  | "default-src"
  | "base-uri"
  | "object-src"
  | "script-src"
  | "style-src"
  | "img-src"
  | "connect-src"
  | "font-src"
  | "report-uri";

export const policyConfig = (nonce: string): Record<CspPolicySources, (string | typeof cspSourceKeyWords[0])[]> => ({
  "default-src": ["self"],
  "base-uri": ["self"],
  "object-src": ["none"],
  "script-src": [
    "self",
    "unsafe-inline",
    "strict-dynamic",
    `nonce-${nonce}`,
    "https://www.googletagmanager.com",
    "https://tagmanager.google.com",
    "https://www.google-analytics.com",
    "https://ssl.google-analytics.com",
  ],
  "style-src": ["self", "unsafe-inline", "https://tagmanager.google.com", "https://fonts.googleapis.com"],
  "img-src": [
    "self",
    "www.googletagmanager.com",
    "https://www.google-analytics.com",
    "https://ssl.gstatic.com",
    "https://www.gstatic.com",
  ],
  "connect-src": ["self", "https://www.google-analytics.com"],
  "font-src": ["self", "https://fonts.gstatic.com"],
  "report-uri": ["/api/csp/violation-report"],
});

export function getContentSecurityPolicy(nonceValue: string): string {
  const policyKeyDelimiter = "; ";
  const cspConfig = policyConfig(nonceValue);

  const configkeys = Object.keys(cspConfig) as CspPolicySources[];

  const getCspValue = (cspValue: string) => {
    const isNonce = cspValue.slice(0, 6) === "nonce-";
    const isQuoteValid = quotedKeywords.includes(cspValue);
    return isNonce || isQuoteValid ? `'${cspValue}'` : cspValue;
  };

  const cspPolicy = configkeys.reduce((partialPolicyString, policyKey) => {
    const policyOptions = cspConfig[policyKey];
    const policyValue = policyOptions.map(getCspValue).join(" ");
    const nextCspPolicy = `${policyKey} ${policyValue}` + policyKeyDelimiter;

    return partialPolicyString.concat(nextCspPolicy);
  }, "");

  return cspPolicy.trim();
}
