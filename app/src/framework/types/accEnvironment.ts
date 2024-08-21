import { AccEnvironment } from "@framework/constants/enums";

/**
 * Parse an incoming ACC Environment.
 *
 * @param value The ACC Environment to parse.
 * @returns The parsed log level value. Defaults to BASE if not found.
 */
export function parseAccEnvironment(value?: string | AccEnvironment): AccEnvironment {
  switch ((value || "").toLowerCase()) {
    case AccEnvironment.BASE:
      return AccEnvironment.BASE;
    case AccEnvironment.AT:
      return AccEnvironment.AT;
    case AccEnvironment.CUSTOM:
      return AccEnvironment.CUSTOM;
    case AccEnvironment.DEMO:
      return AccEnvironment.DEMO;
    case AccEnvironment.DEV:
      return AccEnvironment.DEV;
    case AccEnvironment.PERF:
      return AccEnvironment.PERF;
    case AccEnvironment.PREPROD:
      return AccEnvironment.PREPROD;
    case AccEnvironment.PROD:
      return AccEnvironment.PROD;
    case AccEnvironment.SYSINT:
      return AccEnvironment.SYSINT;
    case AccEnvironment.UAT:
      return AccEnvironment.UAT;
    case AccEnvironment.LOCAL:
      return AccEnvironment.LOCAL;
    case AccEnvironment.CAPDEV:
      return AccEnvironment.CAPDEV;
    default:
      return AccEnvironment.UNKNOWN;
  }
}
