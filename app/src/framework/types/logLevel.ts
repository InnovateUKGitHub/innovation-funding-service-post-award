import { LogLevel } from "@framework/constants";

/**
 * Converts string to corresponding LogLevel enum
 *
 * @param {string} value string to match against LogLevel
 * @returns {LogLevel} LogLevel
 */
export function parseLogLevel(value: string) {
  switch ((value || "").toUpperCase()) {
    case "VERBOSE":
      return LogLevel.VERBOSE;
    case "DEBUG":
      return LogLevel.DEBUG;
    case "INFO":
      return LogLevel.INFO;
    case "WARN":
      return LogLevel.WARN;
    case "ERROR":
    default:
      return LogLevel.ERROR;
  }
}
