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
  | "report-uri"
  | "frame-src";

export const policyConfig = (nonce: string): Record<CspPolicySources, (string | typeof cspSourceKeyWords[0])[]> => ({
  "default-src": ["self"],
  "base-uri": ["self"],
  "object-src": ["none"],
  "script-src": [
    "self",
    "unsafe-eval",
    "strict-dynamic",
    `nonce-${nonce}`,
    "https://www.googletagmanager.com",
    "https://tagmanager.google.com",
    "https://*.google-analytics.com",
    "https://tagassistant.google.com/",
  ],
  "style-src": [
    "self",
    "unsafe-inline",
    "https://tagmanager.google.com",
    "https://fonts.googleapis.com",
    "https://www.googletagmanager.com",
  ],
  "img-src": [
    "self",
    "data:",
    "https://www.googletagmanager.com",
    "https://www.google-analytics.com",
    "https://ssl.gstatic.com",
    "https://www.gstatic.com",
    "https://fonts.gstatic.com",
  ],
  "frame-src": ["https://www.googletagmanager.com"],
  "connect-src": ["self", "https://*.google-analytics.com"],
  "font-src": ["self", "https://assets.publishing.service.gov.uk/frontend/", "https://fonts.gstatic.com"],
  "report-uri": ["/api/csp/violation-report"],
});

/**
 * returns CSP configured with the passed in nonce
 */
export function getContentSecurityPolicy(nonceValue: string): string {
  const policyKeyDelimiter = "; ";
  const cspConfig = policyConfig(nonceValue);

  const configKeys = Object.keys(cspConfig) as CspPolicySources[];

  const getCspValue = (cspValue: string) => {
    const isNonce = cspValue.slice(0, 6) === "nonce-";
    const isQuoteValid = quotedKeywords.includes(cspValue);
    return isNonce || isQuoteValid ? `'${cspValue}'` : cspValue;
  };

  const cspPolicy = configKeys.reduce((partialPolicyString, policyKey) => {
    const policyOptions = cspConfig[policyKey];
    const policyValue = policyOptions.map(getCspValue).join(" ");
    const nextCspPolicy = `${policyKey} ${policyValue}` + policyKeyDelimiter;

    return partialPolicyString.concat(nextCspPolicy);
  }, "");

  return cspPolicy.trim();
}
