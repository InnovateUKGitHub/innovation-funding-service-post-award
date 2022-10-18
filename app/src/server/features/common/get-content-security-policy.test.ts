import { getContentSecurityPolicy, policyConfig } from "@server/features/common/get-content-security-policy";

const stubNonce = "STUB_UNIQUE_NONCE_VALUE";

describe("policyConfig()", () => {
  it("returns with config", () => {
    const config = policyConfig(stubNonce);

    expect(config).toMatchSnapshot();
  });
});

describe("getContentSecurityPolicy()", () => {
  describe("@returns", () => {
    test("with expected nonce", () => {
      const stubUniqueNonce = "chicken";
      const config = getContentSecurityPolicy(stubUniqueNonce);

      const expectedNonce = `nonce-${stubUniqueNonce}`;

      expect(config).toContain(expectedNonce);
    });

    test("with correct formatting", () => {
      const config = getContentSecurityPolicy(stubNonce);

      expect(config).toMatchSnapshot();
    });

    test("with report-uri as last policy", () => {
      const config = getContentSecurityPolicy(stubNonce);

      // Note: Separate csp policy using delimiter
      const cspPolicies = config.split("; ");
      const lastCspPolicy = cspPolicies[cspPolicies.length - 1];

      expect(lastCspPolicy).toContain("report-uri");
    });
  });
});
